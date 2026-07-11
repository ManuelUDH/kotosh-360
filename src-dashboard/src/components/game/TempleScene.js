import React, { useState } from 'react';
import * as THREE from 'three';
import { useTexture, Html } from '@react-three/drei';
import CrossedHands from './CrossedHands';
import DustParticles from './DustParticles';
import { useLanguage } from '../../context/LanguageContext';


// ─── WALL COMPONENT ───────────────────────────────────────────────────────────
function AdobeWall({ width, height, depth = 1.0, position, rotation, color = '#8a7860', plastered = false, texture = null }) {
  const mainColor = plastered ? '#b0a090' : color;
  
  // Clone texture to allow different repeats per wall if necessary, but here we just repeat based on width/height
  const tex = texture ? texture.clone() : null;
  if (tex) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 2, height / 2);
    tex.needsUpdate = true;
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={texture ? '#ffffff' : mainColor} 
          map={tex}
          roughness={0.92} 
          metalness={0} 
        />
      </mesh>
    </group>
  );
}

// ─── T-SHAPED NICHE (Kotosh Style) ──────────────────────────────────────────
function TrapezoidalNiche({ position, rotation = [0, 0, 0], scale = 1, texture = null }) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Deep shadow boxes simulating the T-shaped hole */}
      {/* Top horizontal bar of the T */}
      <mesh position={[0, 0.2, 0.02]} receiveShadow>
        <boxGeometry args={[0.8, 0.4, 0.04]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} metalness={0} />
      </mesh>
      {/* Bottom vertical stem of the T */}
      <mesh position={[0, -0.25, 0.02]} receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.04]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} metalness={0} />
      </mesh>
      
      {/* Frame projecting slightly to give physical depth */}
      <mesh position={[0, 0.45, 0.04]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-0.45, 0.2, 0.04]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.45, 0.2, 0.04]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-0.25, -0.05, 0.04]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.25, -0.05, 0.04]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, -0.55, 0.04]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.04]} />
        <meshStandardMaterial map={texture} color="#a09080" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

// ─── LOW MUD BENCH ────────────────────────────────────────────────────────────
function MudBench({ width, position, rotation = [0, 0, 0], texture = null }) {
  const tex = texture ? texture.clone() : null;
  if (tex) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 2, 0.5);
    tex.needsUpdate = true;
  }
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.35, 0.5]} />
        <meshStandardMaterial map={tex} color={texture ? '#ffffff' : "#a09080"} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[width - 0.05, 0.04, 0.48]} />
        <meshStandardMaterial map={tex} color={texture ? '#eeeeee' : "#b0a090"} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

// ─── SUNKEN PATIO ─────────────────────────────────────────────────────────────
function SunkenPatio({ position = [0, 0, 0], floorTexture = null, wallTexture = null }) {
  const fTex = floorTexture ? floorTexture.clone() : null;
  if (fTex) {
    fTex.wrapS = THREE.RepeatWrapping;
    fTex.wrapT = THREE.RepeatWrapping;
    fTex.repeat.set(1.5, 1.5);
  }
  return (
    <group position={position}>
      {/* Recessed floor */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.05, 2.4]} />
        <meshStandardMaterial map={fTex} color={fTex ? '#ffffff' : "#5e4e3e"} roughness={1} metalness={0} />
      </mesh>
      {/* Recess walls */}
      <mesh position={[0, -0.15, 1.2]} castShadow>
        <boxGeometry args={[2.4, 0.3, 0.1]} />
        <meshStandardMaterial map={wallTexture} color={wallTexture ? '#ffffff' : "#6a5a48"} roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[0, -0.15, -1.2]} castShadow>
        <boxGeometry args={[2.4, 0.3, 0.1]} />
        <meshStandardMaterial map={wallTexture} color={wallTexture ? '#ffffff' : "#6a5a48"} roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[-1.2, -0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 2.4]} />
        <meshStandardMaterial map={wallTexture} color={wallTexture ? '#ffffff' : "#6a5a48"} roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[1.2, -0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 2.4]} />
        <meshStandardMaterial map={wallTexture} color={wallTexture ? '#ffffff' : "#6a5a48"} roughness={0.95} metalness={0} />
      </mesh>
      {/* Central hearth pit base */}
      <mesh position={[0, -0.28, 0]} receiveShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#1a1108" roughness={1} metalness={0} />
      </mesh>

      {/* Fire Logs */}
      <mesh position={[0.08, -0.22, 0.08]} rotation={[0, Math.PI/4, Math.PI/6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        <meshStandardMaterial color="#1a0b05" roughness={1} />
      </mesh>
      <mesh position={[-0.08, -0.22, 0.05]} rotation={[0, -Math.PI/3, Math.PI/8]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        <meshStandardMaterial color="#1a0b05" roughness={1} />
      </mesh>
      <mesh position={[0, -0.20, -0.1]} rotation={[Math.PI/5, 0, Math.PI/2.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        <meshStandardMaterial color="#1a0b05" roughness={1} />
      </mesh>

      {/* Fire Core (glowing embers) */}
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffee66" transparent opacity={0.8} />
      </mesh>

      {/* Ventilation shaft opening */}
      <mesh position={[0, -0.3, -1.15]}>
        <boxGeometry args={[0.25, 0.18, 0.12]} />
        <meshStandardMaterial color="#0d0808" roughness={1} metalness={0} />
      </mesh>

      {/* Warm glow from underground hearth - Moved slightly up and made brighter */}
      <pointLight position={[0, 0.2, 0]} color="#ff7711" intensity={2.5} distance={7} decay={2} castShadow />
    </group>
  );
}

// ─── STONE PLATFORM ───────────────────────────────────────────────────────────
function StonePlatform({ width, height, depth, position, color = '#796b58' }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  );
}

// ─── ANDEAN TREE ──────────────────────────────────────────────────────────────
function AndeanTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, 3.8, 0]} castShadow>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="#1a4a18" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0.8, 3.2, 0.5]} castShadow>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#1a4a18" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

// ─── INTERACTIVE GUIDE (Sprite) ───────────────────────────────────────────────
function Guide({ position, titleKey, textKey }) {
  const [speaking, setSpeaking] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const guideTex = useTexture('/textures/guide_sprite.png');
  const { t } = useLanguage();

  const title = t(titleKey);
  const text = t(textKey);
  const voiceLang = t('voiceLang');
  const speakingStatus = t('speakingStatus');
  const listenStatus = t('listenStatus');

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = voiceLang;
    utter.rate  = 0.92;
    utter.pitch = 1.0;
    utter.onstart = () => { setSpeaking(true); };
    utter.onend   = () => { setSpeaking(false); };
    utter.onerror = () => { setSpeaking(false); };
    window.speechSynthesis.speak(utter);
  };

  return (
    <group position={position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sprite position={[0, 0.9, 0]} scale={[1.8, 1.8, 1.8]}>
        <spriteMaterial
          map={guideTex}
          transparent
          alphaTest={0.1}
          opacity={hovered ? 1.0 : 0.95}
          color={hovered ? '#ffe0a0' : '#ffffff'}
          depthWrite={false}
        />
      </sprite>

      <mesh position={[0, 0.9, 0]} visible={false}>
        <boxGeometry args={[1.0, 1.8, 0.3]} />
        <meshBasicMaterial />
      </mesh>

      <Html position={[0, 2.15, 0]} center transform sprite style={{ pointerEvents: 'none' }}>
        <div style={{
          background: speaking ? 'rgba(30,150,30,0.93)' : 'rgba(10,10,10,0.8)',
          color: 'white', padding: '5px 12px', borderRadius: '8px',
          fontFamily: 'sans-serif', fontSize: '12px', whiteSpace: 'nowrap',
          border: speaking ? '2px solid #66ff66' : '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.5)', textAlign: 'center',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{title}</div>
          <div style={{ fontSize: '10px', opacity: 0.85 }}>
            {speaking ? speakingStatus : listenStatus}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── MAIN TEMPLE SCENE ────────────────────────────────────────────────────────
export default function TempleScene() {
  const adobeTex = useTexture('/textures/adobe.png');
  const dirtTex = useTexture('/textures/dirt.png');
  const strawTex = useTexture('/textures/straw.png');
  const mountainTex = useTexture('/textures/mountains.png');
  mountainTex.colorSpace = THREE.SRGBColorSpace;
  
  const nicheWallTex = useTexture('/textures/niches_wall_wide.png');
  nicheWallTex.colorSpace = THREE.SRGBColorSpace;
  
  const gTex = dirtTex.clone();
  gTex.wrapS = THREE.RepeatWrapping;
  gTex.wrapT = THREE.RepeatWrapping;
  gTex.repeat.set(15, 15);

  const sTex = strawTex.clone();
  sTex.wrapS = THREE.RepeatWrapping;
  sTex.wrapT = THREE.RepeatWrapping;
  sTex.repeat.set(8, 4);
  return (
    <group>
      {/* === GROUND === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial map={gTex} color="#ffffff" roughness={1} metalness={0} />
      </mesh>
      {/* Dirt path to staircase */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 13]}>
        <planeGeometry args={[7, 10]} />
        <meshStandardMaterial map={dirtTex} color="#ffffff" roughness={1} metalness={0} />
      </mesh>

      {/* === TERRACED PYRAMID (scaled ~50% horizontally) === */}
      <StonePlatform width={36} height={1.5} depth={26} position={[0, 0.75, 0]} color="#6b6050" />
      <StonePlatform width={26} height={1.5} depth={18} position={[0, 2.25, 0]} color="#7a7060" />
      <StonePlatform width={18} height={2.0} depth={12} position={[0, 4.0,  0]} color="#8a8070" />

      {/* === KOTOSH EXTERIOR STRUCTURES (scaled ~50%) === */}

      {/* --- SECONDARY MOUND (west side, lower) --- */}
      <StonePlatform width={20} height={1.2} depth={15} position={[-28, 0.6,  -5]} color="#6a5e50" />
      <StonePlatform width={14} height={1.2} depth={10} position={[-28, 1.8,  -5]} color="#776858" />
      <StonePlatform width={9}  height={1.5} depth={7}  position={[-28, 3.15, -5]} color="#847870" />
      <AdobeWall width={6} height={2.0} depth={1.0} position={[-28, 4.9, -7]} texture={adobeTex} />
      <AdobeWall width={6} height={1.4} depth={1.0} position={[-28, 4.6, -3]} texture={adobeTex} />
      <AdobeWall width={5} height={2.2} depth={1.0} position={[-31, 4.9, -5]} rotation={[0, Math.PI/2, 0]} texture={adobeTex} plastered />
      <AdobeWall width={4} height={1.8} depth={1.0} position={[-25, 4.7, -5]} rotation={[0, Math.PI/2, 0]} texture={adobeTex} />

      {/* --- ENCLOSURE A: NW --- */}
      <group position={[-22, 1.5, 10]}>
        <AdobeWall width={10} height={2.2} depth={1.0} position={[0, 1.1,  4]}  texture={adobeTex} />
        <AdobeWall width={10} height={1.6} depth={1.0} position={[0, 0.8, -4]}  texture={adobeTex} plastered />
        <AdobeWall width={5}  height={2.0} depth={1.0} position={[-5, 1.0, 0]}  rotation={[0, Math.PI/2, 0]} texture={adobeTex} />
        <AdobeWall width={4}  height={1.5} depth={1.0} position={[5,  0.75, 0]} rotation={[0, Math.PI/2, 0]} texture={adobeTex} />
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[8, 0.12, 6]} />
          <meshStandardMaterial map={dirtTex} color="#7a6a58" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.16, 12]} />
          <meshStandardMaterial color="#2a1f14" roughness={1} metalness={0} />
        </mesh>
      </group>

      {/* --- ENCLOSURE B: NE --- */}
      <group position={[24, 1.5, 10]}>
        <AdobeWall width={8} height={2.0} depth={1.0} position={[0, 1.0,  4]}  texture={adobeTex} plastered />
        <AdobeWall width={8} height={1.3} depth={1.0} position={[0, 0.65,-4]}  texture={adobeTex} />
        <AdobeWall width={4} height={2.2} depth={1.0} position={[-4, 1.1, 0]}  rotation={[0, Math.PI/2, 0]} texture={adobeTex} />
        <AdobeWall width={4} height={1.8} depth={1.0} position={[4,  0.9, 0]}  rotation={[0, Math.PI/2, 0]} texture={adobeTex} plastered />
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[6, 0.12, 6]} />
          <meshStandardMaterial map={dirtTex} color="#6a5a48" roughness={1} metalness={0} />
        </mesh>
      </group>

      {/* --- ENCLOSURE C: South-rear --- */}
      <group position={[-12, 1.5, -16]}>
        <AdobeWall width={7} height={1.8} depth={1.0} position={[0, 0.9,  3]}  texture={adobeTex} />
        <AdobeWall width={7} height={2.1} depth={1.0} position={[0, 1.05,-3]}  texture={adobeTex} plastered />
        <AdobeWall width={4} height={1.6} depth={1.0} position={[-3.5, 0.8, 0]} rotation={[0, Math.PI/2, 0]} texture={adobeTex} />
      </group>

      {/* --- ENCLOSURE D: SE corridor --- */}
      <group position={[18, 1.5, -14]}>
        <AdobeWall width={10} height={1.5} depth={1.0} position={[0, 0.75, 2]}  texture={adobeTex} />
        <AdobeWall width={10} height={2.0} depth={1.0} position={[0, 1.0, -2]}  texture={adobeTex} plastered />
        <AdobeWall width={3}  height={1.7} depth={1.0} position={[-5, 0.85, 0]} rotation={[0, Math.PI/2, 0]} texture={adobeTex} />
      </group>

      {/* --- LOW FOUNDATION WALLS --- */}
      <AdobeWall width={10} height={0.7} depth={1.0} position={[-12, 0.35, 18]} texture={adobeTex} />
      <AdobeWall width={7}  height={0.5} depth={1.0} position={[12,  0.25, 20]} texture={adobeTex} plastered />
      <AdobeWall width={6}  height={0.6} depth={1.0} position={[-20, 0.3,  14]} texture={adobeTex} />
      <AdobeWall width={8}  height={0.7} depth={1.0} position={[8,   0.35,-22]} texture={adobeTex} plastered />
      <AdobeWall width={6}  height={0.5} depth={1.0} position={[-8,  0.25,-20]} texture={adobeTex} />

      {/* --- RUBBLE PILES --- */}
      {[
        [-10, 1.5, 5], [10, 1.5, -5], [-14, 1.5, -8], [12, 1.5, 7],
        [-22, 0, 16],  [24, 0, 16],   [-30, 0, -3],    [28, 0, -15],
      ].map(([rx, ry, rz], ri) => (
        <mesh key={`rubble-${ri}`} position={[rx, ry, rz]} rotation={[0, ri * 0.8, 0]}>
          <boxGeometry args={[1.2 + (ri % 3) * 0.4, 0.4, 0.9 + (ri % 2) * 0.3]} />
          <meshStandardMaterial color={ri % 2 === 0 ? '#7a6a58' : '#6a5a48'} roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* === STAIRCASE — 10 steps, 1m tread, 6m wide === */}
      {Array.from({ length: 10 }, (_, i) => {
        const blockH = (i + 1) * 0.5;           // riser accumulates
        const blockZ = 18.0 - (i + 0.5) * 1.0;  // tread depth = 1.0m
        const blockY = blockH / 2;
        const shade = i % 2 === 0 ? '#817060' : '#8a7a68';
        const tex = adobeTex.clone();
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(3, blockH / 0.4);
        tex.needsUpdate = true;
        return (
          <mesh key={`step-${i}`} position={[0, blockY, blockZ]} castShadow receiveShadow>
            <boxGeometry args={[6, blockH, 1.0]} />
            <meshStandardMaterial map={tex} color={shade} roughness={0.95} metalness={0} />
          </mesh>
        );
      })}
      {/* Side walls flanking the staircase */}
      {[-3.3, 3.3].map((sx, si) => (
        <mesh key={`stairwall-${si}`} position={[sx, 2.5, 13.0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 5.0, 10]} />
          <meshStandardMaterial map={adobeTex} color="#7a6a58" roughness={0.96} metalness={0} />
        </mesh>
      ))}

      {/* === GAP FILL: full-height block matching the staircase, seals the hollow between
           the last step (z=8.5) and the top terrace front face (z=6) === */}
      <mesh position={[0, 2.5, 7.25]} castShadow receiveShadow>
        <boxGeometry args={[7, 5.0, 2.5]} />
        <meshStandardMaterial map={adobeTex} color="#817060" roughness={0.95} metalness={0} />
      </mesh>
      {/* Approach pad at ground level in front of first step */}
      <mesh position={[0, 0.1, 19.5]} receiveShadow>
        <boxGeometry args={[8, 0.2, 3]} />
        <meshStandardMaterial map={dirtTex} color="#8a7a66" roughness={1} metalness={0} />
      </mesh>

      {/* === ANDEAN MOUNTAIN RANGE (Panoramic Background) === */}
      <mesh position={[0, -2, 0]} rotation={[0, Math.PI, 0]}>
        {/* Full 360 panorama: Radius 140, Height 90, 32 segments, openEnded=true */}
        <cylinderGeometry args={[140, 140, 90, 32, 1, true, 0, Math.PI * 2]} />
        <meshBasicMaterial map={mountainTex} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      {/* === ARCHAEOLOGICAL SIGN POST (like 'TEMPLO BLANCO' in the real photo) === */}
      <group position={[10, 0, 17]}>
        {/* Wooden post */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
          <meshStandardMaterial color="#2a1a0a" roughness={1} metalness={0} />
        </mesh>
        {/* Green sign board */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[1.5, 0.62, 0.07]} />
          <meshStandardMaterial color="#1a5c1a" roughness={0.7} metalness={0} />
        </mesh>
        {/* White border frame */}
        <mesh position={[0, 1.35, 0.035]}>
          <boxGeometry args={[1.46, 0.58, 0.01]} />
          <meshStandardMaterial color="#2a7a2a" roughness={0.6} metalness={0} />
        </mesh>
        {/* Sign text via Html */}
        <Html position={[0, 1.35, 0.08]} center transform distanceFactor={4}>
          <div style={{
            color: '#ffffff',
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontWeight: '900',
            fontSize: '11px',
            textAlign: 'center',
            lineHeight: '1.3',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            KOTOSH 360<br/>TEMPLO
          </div>
        </Html>
      </group>

      {/* === SCATTERED ROCKS AND BOULDERS (like the real site) === */}
      {[
        // [x, z, scale, rotY]
        [6,   16, 0.55, 0.4], [-8,  15, 0.7,  1.2], [4,  20, 0.45, 2.1],
        [-5,  18, 0.5,  0.8], [12,  14, 0.8,  1.8], [-12, 13, 0.6, 0.3],
        [7,   12, 0.4,  2.5], [-6,  12, 0.65, 1.1], [3,  13, 0.35, 0.7],
        [15,  10, 0.9,  0.2], [-16,  9, 0.75, 1.9], [18, 16, 0.5,  0.5],
        [-18, 14, 0.55, 2.3], [20,  12, 0.45, 1.6], [-20, 8, 0.7,  0.9],
        [9,  -5, 0.8,  1.3],  [-11, -4, 0.6,  2.0], [6, -8, 0.5,  0.6],
        [-7,  -6, 0.65, 1.7], [14,  -8, 0.7,  0.4], [-14,-5, 0.45, 2.8],
      ].map(([rx, rz, rs, ry], ri) => {
        const col = ri % 3 === 0 ? '#6a6255' : ri % 3 === 1 ? '#5a5245' : '#7a7265';
        return (
          <mesh key={`rock-${ri}`} position={[rx, rs * 0.28, rz]} rotation={[ri * 0.2, ry, ri * 0.15]} castShadow receiveShadow>
            <dodecahedronGeometry args={[rs, 0]} />
            <meshStandardMaterial color={col} roughness={1} metalness={0} />
          </mesh>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* === MAIN TEMPLE === */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <group position={[0, 5.0, -2]}>
        {/* Floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.3, 10.5]} />
          <meshStandardMaterial map={dirtTex} color="#ffffff" roughness={1} metalness={0} />
        </mesh>

        {/* ── WALLS (1m thick) ── */}
        <AdobeWall width={10.5} height={3.0} depth={1.0} position={[0, 1.8, -5]} texture={adobeTex} plastered />
        <AdobeWall width={10.5} height={3.0} depth={1.0} position={[5.25, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} texture={adobeTex} />
        <AdobeWall width={10.5} height={3.0} depth={1.0} position={[-5.25, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]} texture={adobeTex} plastered />
        <AdobeWall width={3.8} height={3.0} depth={1.0} position={[-3.35, 1.8, 5]} texture={adobeTex} />
        <AdobeWall width={3.8} height={3.0} depth={1.0} position={[3.35, 1.8, 5]} texture={adobeTex} plastered />
        <AdobeWall width={3.2} height={0.6} depth={1.0} position={[0, 3.5, 5]} texture={adobeTex} />

        {/* ── STRAW ROOF ── */}
        <group position={[0, 5.0, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            {/* radiusTop=1.5, radiusBottom=8.5, height=3.5, radialSegments=4, openEnded=true */}
            <cylinderGeometry args={[1.5, 8.5, 3.5, 4, 1, true]} />
            <meshStandardMaterial map={sTex} color="#f0dca0" roughness={0.9} side={THREE.DoubleSide} metalness={0} />
          </mesh>
          {/* Wood beams supporting the roof */}
          {[Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4].map((angle, i) => (
            <mesh key={i} position={[Math.cos(angle)*4, -0.2, Math.sin(angle)*4]} rotation={[Math.PI/2 - 0.4, 0, angle + Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 10, 8]} />
              <meshStandardMaterial color="#3a2818" roughness={1} metalness={0} />
            </mesh>
          ))}
        </group>

        {/* ── SUNKEN PATIO ── */}
        <SunkenPatio position={[0, 0.15, 0]} floorTexture={dirtTex} wallTexture={adobeTex} />

        {/* ── NICHES (Kotosh T-Shape pattern) ── */}
        {/* Back wall (Flanking the crossed hands, kept as 3D geometry) */}
        <TrapezoidalNiche position={[-3.5, 2.0, -4.45]} scale={0.8} texture={adobeTex} />
        <TrapezoidalNiche position={[3.5, 2.0, -4.45]} scale={0.8} texture={adobeTex} />
        <TrapezoidalNiche position={[0, 2.8, -4.45]} scale={0.6} texture={adobeTex} />

        {/* ── SIDE WALLS WITH REALISTIC PHOTO TEXTURE & RELIEF ── */}
        {/* Right side wall */}
        <mesh position={[4.6, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
          <planeGeometry args={[10.5, 3.0, 512, 128]} />
          <meshStandardMaterial 
            map={nicheWallTex} 
            color="#ebd2b9" 
            displacementMap={nicheWallTex}
            displacementScale={0.15}
            displacementBias={-0.07}
            bumpMap={nicheWallTex} 
            bumpScale={0.4} 
            roughness={1.0} 
            metalness={0} 
          />
        </mesh>
        
        {/* Left side wall */}
        <mesh position={[-4.6, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
          <planeGeometry args={[10.5, 3.0, 512, 128]} />
          <meshStandardMaterial 
            map={nicheWallTex} 
            color="#ebd2b9" 
            displacementMap={nicheWallTex}
            displacementScale={0.15}
            displacementBias={-0.07}
            bumpMap={nicheWallTex} 
            bumpScale={0.4} 
            roughness={1.0} 
            metalness={0} 
          />
        </mesh>

        {/* ── BENCHES ── */}
        <MudBench width={9} position={[0, 0.2, -4.3]} texture={adobeTex} />
        <MudBench width={4} position={[4.3, 0.2, -1.5]} rotation={[0, Math.PI / 2, 0]} texture={adobeTex} />
        <MudBench width={4} position={[-4.3, 0.2, -1.5]} rotation={[0, -Math.PI / 2, 0]} texture={adobeTex} />

        {/* ── CROSSED HANDS (2 pairs) ── */}
        <CrossedHands position={[0, 1.4, -4.4]} />

        {/* ── INTERIOR GUIDE ── */}
        <Guide
          position={[-3.0, 0, -1.0]}
          titleKey="guideIntTitle"
          textKey="guideIntText"
        />

        {/* ── DUST PARTICLES ── */}
        <DustParticles bounds={[10, 4, 10]} color="#ffe8c0" />

        {/* Interior light */}
        <pointLight position={[0, 2.5, 0]} color="#c07832" intensity={0.5} distance={14} decay={2} />
      </group>

      {/* === EXTERIOR GUIDE === */}
      <Guide
        position={[8.5, 0, 17]}
        titleKey="guideExtTitle"
        textKey="guideExtText"
      />

      {/* === VEGETATION === */}
      {[
        [-25, 0, -18], [28, 0, -15], [-22, 0,  6], [30, 0,  0],
        [-28, 0, -6],  [26, 0,  8], [-20, 0, -24], [24, 0, -20],
        [-38, 0,  3],  [38, 0, -6], [-35, 0, -14], [36, 0, 14],
        [-18, 0,  28], [18, 0,  28], [0, 0, 35],  [-30, 0, 22],
      ].map(([x, y, z], i) => (
        <AndeanTree key={i} position={[x, y, z]} scale={0.75 + (i % 4) * 0.1} />
      ))}
    </group>
  );
}
