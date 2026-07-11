import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Single crossed-hands niche panel with real 3D relief.
 * Uses displacement + bump maps so the terracotta hands protrude from the wall.
 * Size ~0.9 x 1.05 m (near life-size niche).
 */
function HandsPanel({ position = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);

  // Load the same image as color map AND relief maps
  const tex = useTexture('/textures/hands_niche.png');

  // Clone for bump/displacement so we can tweak them independently
  const bumpTex = tex.clone();
  bumpTex.needsUpdate = true;
  const dispTex = tex.clone();
  dispTex.needsUpdate = true;

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Interaction indicator — minimal glowing dot */}
      <Html position={[0, 0.75, 0.12]} center zIndexRange={[100, 0]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: hovered ? '#fff' : 'rgba(255,220,120,0.9)',
            boxShadow: hovered
              ? '0 0 12px 4px rgba(255,255,255,0.8)'
              : '0 0 8px 2px rgba(255,200,80,0.6)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }} />
          {hovered && (
            <div style={{
              background: 'rgba(10,8,5,0.85)',
              color: '#f5dfa0',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,200,80,0.3)',
            }}>
              Interactuar
            </div>
          )}
        </div>
      </Html>

      {/* Adobe niche surround */}
      <mesh position={[0, 0, -0.07]} receiveShadow>
        <boxGeometry args={[1.15, 1.3, 0.12]} />
        <meshStandardMaterial color="#6a5040" roughness={1} metalness={0} />
      </mesh>

      {/* Niche inner back wall (dark recess) */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <boxGeometry args={[0.95, 1.1, 0.05]} />
        <meshStandardMaterial color="#3a2818" roughness={1} metalness={0} />
      </mesh>

      {/*
        ──────────────────────────────────────────────────────────
        RELIEF PANEL — high-poly plane so displacement can sculpt
        the geometry. The hands area (lighter pixels) will pop out,
        darker areas (shadow/background) will stay recessed.
        ──────────────────────────────────────────────────────────
      */}
      <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
        {/* 128×128 segments give enough geometry for smooth displacement */}
        <planeGeometry args={[0.9, 1.05, 128, 128]} />
        <meshStandardMaterial
          map={tex}
          bumpMap={bumpTex}
          bumpScale={0.018}           /* subtle surface grain */
          displacementMap={dispTex}
          displacementScale={0.07}    /* hands protrude ~7 cm */
          displacementBias={-0.03}    /* push base back slightly */
          roughness={0.88}
          metalness={0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Small brick shelf below */}
      <mesh position={[0, -0.73, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.1, 0.24]} />
        <meshStandardMaterial color="#8a6848" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/**
 * Two crossed-hands niches on the back wall — symmetric placement.
 */
export default function CrossedHands({ position = [0, 0, 0] }) {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (light1Ref.current) light1Ref.current.intensity = 0.5 + Math.sin(t * 3.5) * 0.06;
    if (light2Ref.current) light2Ref.current.intensity = 0.5 + Math.sin(t * 3.2 + 1.5) * 0.06;
  });

  // Separation between the two niches — matches wall width
  const sep = 3.2;

  return (
    <group position={position}>
      {/* Warm flickering lights — ritual torch atmosphere */}
      <pointLight ref={light1Ref} position={[-sep / 2, 0.3, 1.2]} color="#f4a460" intensity={0.5} distance={4} decay={2} />
      <pointLight ref={light2Ref} position={[ sep / 2, 0.3, 1.2]} color="#f4a460" intensity={0.5} distance={4} decay={2} />

      <HandsPanel position={[-sep / 2, 0, 0]} />
      <HandsPanel position={[ sep / 2, 0, 0]} />
    </group>
  );
}
