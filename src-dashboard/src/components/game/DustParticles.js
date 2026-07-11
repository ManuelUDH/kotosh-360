import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 120;

/**
 * Volumetric dust particles floating in light beams inside the temple.
 * Simulates ancient dust suspended in shafts of golden sunlight.
 */
export default function DustParticles({ bounds = [8, 5, 8], color = '#ffe8c0' }) {
  const meshRef = useRef();
  const velocities = useRef([]);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);
    const vel = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position within temple bounds
      pos[i * 3] = (Math.random() - 0.5) * bounds[0];
      pos[i * 3 + 1] = Math.random() * bounds[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * bounds[2];
      siz[i] = 0.03 + Math.random() * 0.06;

      // Slow drifting velocities
      vel.push({
        x: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.3) * 0.08, // slight upward bias
        z: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
    velocities.current = vel;
    return { positions: pos, sizes: siz };
  }, [bounds]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    const t = clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = velocities.current[i];
      let x = posAttr.array[i * 3];
      let y = posAttr.array[i * 3 + 1];
      let z = posAttr.array[i * 3 + 2];

      // Drift + subtle sinusoidal sway
      x += v.x * 0.016 + Math.sin(t * 0.5 + v.phase) * 0.002;
      y += v.y * 0.016 + Math.sin(t * 0.3 + v.phase * 1.5) * 0.001;
      z += v.z * 0.016 + Math.cos(t * 0.4 + v.phase) * 0.002;

      // Wrap around bounds
      if (x > bounds[0] / 2) x = -bounds[0] / 2;
      if (x < -bounds[0] / 2) x = bounds[0] / 2;
      if (y > bounds[1]) y = 0;
      if (y < 0) y = bounds[1];
      if (z > bounds[2] / 2) z = -bounds[2] / 2;
      if (z < -bounds[2] / 2) z = bounds[2] / 2;

      posAttr.array[i * 3] = x;
      posAttr.array[i * 3 + 1] = y;
      posAttr.array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
