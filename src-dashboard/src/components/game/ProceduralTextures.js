import * as THREE from 'three';

// Simplex-like noise for procedural textures
function hash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return (h ^ (h >> 16)) / 2147483648;
}

function noise2D(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const n00 = hash(ix, iy);
  const n10 = hash(ix + 1, iy);
  const n01 = hash(ix, iy + 1);
  const n11 = hash(ix + 1, iy + 1);
  return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy;
}

function fbm(x, y, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

// Crack pattern generator - returns 0-1 where 1 = crack
function crackPattern(x, y, density = 8, thickness = 0.03) {
  const cx = x * density;
  const cy = y * density;
  const n = fbm(cx * 3.7, cy * 3.7, 3);
  const crack = Math.abs(n - 0.5) < thickness ? 1 : 0;
  // Add secondary finer cracks
  const n2 = fbm(cx * 7.3 + 100, cy * 7.3 + 100, 2);
  const crack2 = Math.abs(n2 - 0.5) < thickness * 0.5 ? 0.7 : 0;
  return Math.max(crack, crack2);
}

/**
 * Generate adobe wall texture with deep irregular cracking
 * Returns { map, normalMap, roughnessMap }
 */
export function createAdobeWallTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Normal map canvas
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalCtx = normalCanvas.getContext('2d');
  const normalData = normalCtx.createImageData(width, height);

  // Roughness map canvas
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughCtx = roughCanvas.getContext('2d');
  const roughData = roughCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;

      // Base ochre-sand color
      const baseR = 168 + fbm(nx * 6, ny * 6, 3) * 30 - 15;
      const baseG = 140 + fbm(nx * 6 + 50, ny * 6 + 50, 3) * 25 - 12;
      const baseB = 100 + fbm(nx * 6 + 100, ny * 6 + 100, 3) * 20 - 10;

      // Crack overlay
      const crack = crackPattern(nx, ny, 12, 0.025);
      const crackDark = crack * 0.3;

      // Granular noise for surface texture
      const grain = fbm(nx * 40, ny * 40, 2) * 20 - 10;

      // Smoke stain patches (upper areas)
      const smokeStain = fbm(nx * 2 + 200, ny * 4 + 200, 3) > 0.6 ? 0.7 : 1.0;

      data[idx] = Math.max(0, Math.min(255, (baseR + grain) * (1 - crackDark) * smokeStain));
      data[idx + 1] = Math.max(0, Math.min(255, (baseG + grain) * (1 - crackDark) * smokeStain));
      data[idx + 2] = Math.max(0, Math.min(255, (baseB + grain) * (1 - crackDark) * smokeStain));
      data[idx + 3] = 255;

      // Normal map - perturbed by cracks and grain
      const crackHeight = crack * 0.8;
      const grainNormal = fbm(nx * 30, ny * 30, 2) * 0.3;
      const normalZ = 1.0 - crackHeight * 0.5;
      normalData.data[idx] = Math.max(0, Math.min(255, 128 + (fbm(nx * 20 + 10, ny * 20, 2) - 0.5) * 60));
      normalData.data[idx + 1] = Math.max(0, Math.min(255, 128 + (fbm(nx * 20, ny * 20 + 10, 2) - 0.5) * 60));
      normalData.data[idx + 2] = Math.max(0, Math.min(255, normalZ * 255));
      normalData.data[idx + 3] = 255;

      // Roughness map - high roughness everywhere, slightly smoother in cracks
      const roughness = 220 + grainNormal * 30 - crack * 40;
      roughData.data[idx] = Math.max(0, Math.min(255, roughness));
      roughData.data[idx + 1] = roughData.data[idx];
      roughData.data[idx + 2] = roughData.data[idx];
      roughData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  normalCtx.putImageData(normalData, 0, 0);
  roughCtx.putImageData(roughData, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  return { map, normalMap, roughnessMap };
}

/**
 * Generate terracotta texture for crossed hands reliefs
 * Reddish-brown, denser and slightly smoother than adobe
 */
export function createTerracottaTexture(width = 256, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalCtx = normalCanvas.getContext('2d');
  const normalData = normalCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;

      // Reddish-brown terracotta base
      const baseR = 178 + fbm(nx * 8, ny * 8, 3) * 25 - 12;
      const baseG = 108 + fbm(nx * 8 + 50, ny * 8 + 50, 3) * 20 - 10;
      const baseB = 72 + fbm(nx * 8 + 100, ny * 8 + 100, 3) * 15 - 7;

      // Radial drying fissures
      const fissure = fbm(nx * 15 + 200, ny * 15 + 200, 2);
      const fissureDark = Math.abs(fissure - 0.5) < 0.02 ? 0.6 : 1.0;

      // Subtle grain
      const grain = fbm(nx * 50, ny * 50, 2) * 12 - 6;

      data[idx] = Math.max(0, Math.min(255, (baseR + grain) * fissureDark));
      data[idx + 1] = Math.max(0, Math.min(255, (baseG + grain) * fissureDark));
      data[idx + 2] = Math.max(0, Math.min(255, (baseB + grain) * fissureDark));
      data[idx + 3] = 255;

      // Normal - smoother than adobe
      normalData.data[idx] = 128 + (fbm(nx * 25, ny * 25, 2) - 0.5) * 30;
      normalData.data[idx + 1] = 128 + (fbm(nx * 25 + 10, ny * 25, 2) - 0.5) * 30;
      normalData.data[idx + 2] = 240;
      normalData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  normalCtx.putImageData(normalData, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  return { map, normalMap };
}

/**
 * Generate tamped earth floor texture with ash and sand residue
 */
export function createEarthFloorTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;

      // Brown-ash base
      const baseR = 120 + fbm(nx * 5, ny * 5, 3) * 30 - 15;
      const baseG = 100 + fbm(nx * 5 + 50, ny * 5 + 50, 3) * 25 - 12;
      const baseB = 75 + fbm(nx * 5 + 100, ny * 5 + 100, 3) * 20 - 10;

      // Ash patches (lighter spots)
      const ash = fbm(nx * 3 + 300, ny * 3 + 300, 2) > 0.55 ? 1.15 : 1.0;

      // Fine grain
      const grain = fbm(nx * 60, ny * 60, 2) * 15 - 7;

      data[idx] = Math.max(0, Math.min(255, (baseR + grain) * ash));
      data[idx + 1] = Math.max(0, Math.min(255, (baseG + grain) * ash));
      data[idx + 2] = Math.max(0, Math.min(255, (baseB + grain) * ash));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  return { map };
}

/**
 * Material factory - creates meshStandardMaterial with procedural textures
 * Cached to avoid regenerating textures every frame
 */
const textureCache = {};

export function getAdobeMaterial() {
  if (!textureCache.adobe) {
    textureCache.adobe = createAdobeWallTexture(512, 512);
  }
  return new THREE.MeshStandardMaterial({
    map: textureCache.adobe.map,
    normalMap: textureCache.adobe.normalMap,
    normalScale: new THREE.Vector2(1.5, 1.5),
    roughnessMap: textureCache.adobe.roughnessMap,
    roughness: 0.92,
    metalness: 0.0,
  });
}

export function getTerracottaMaterial() {
  if (!textureCache.terracotta) {
    textureCache.terracotta = createTerracottaTexture(256, 256);
  }
  return new THREE.MeshStandardMaterial({
    map: textureCache.terracotta.map,
    normalMap: textureCache.terracotta.normalMap,
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughness: 0.78,
    metalness: 0.0,
  });
}

export function getEarthFloorMaterial() {
  if (!textureCache.earthFloor) {
    textureCache.earthFloor = createEarthFloorTexture(512, 512);
  }
  return new THREE.MeshStandardMaterial({
    map: textureCache.earthFloor.map,
    roughness: 1.0,
    metalness: 0.0,
  });
}

// Slightly lighter adobe for plaster remnants
export function getPlasterRemnantMaterial() {
  if (!textureCache.plaster) {
    const base = createAdobeWallTexture(256, 256);
    // Lighten the map
    const ctx = base.map.image.getContext('2d');
    const imgData = ctx.getImageData(0, 0, 256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = Math.min(255, imgData.data[i] + 50);
      imgData.data[i + 1] = Math.min(255, imgData.data[i + 1] + 45);
      imgData.data[i + 2] = Math.min(255, imgData.data[i + 2] + 35);
    }
    ctx.putImageData(imgData, 0, 0);
    base.map.needsUpdate = true;
    textureCache.plaster = base;
  }
  return new THREE.MeshStandardMaterial({
    map: textureCache.plaster.map,
    normalMap: textureCache.plaster.normalMap,
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughness: 0.88,
    metalness: 0.0,
  });
}
