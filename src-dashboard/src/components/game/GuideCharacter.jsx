import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Html, useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TARGET_HEIGHT = 1.7; // metres

// ── Inner component: loaded inside Suspense so FBX is guaranteed to exist ──
function GuideInner({ text, title, hovered, setHovered, speaking, setSpeaking }) {
  const mixerRef  = useRef();
  const groupRef  = useRef();
  const scaledRef = useRef(false); // run auto-scale only once, after first render

  const character = useFBX('/models/guide.fbx');
  const animFBX   = useFBX('/models/guide_anim.fbx');

  // Clone preserving hierarchy — do NOT touch scale here
  const cloned = React.useMemo(() => {
    const c = character.clone(true);
    c.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [character]);

  // Start animation mixer
  useEffect(() => {
    if (!cloned || !animFBX?.animations?.length) return;
    const mixer = new THREE.AnimationMixer(cloned);
    mixerRef.current = mixer;
    const action = mixer.clipAction(animFBX.animations[0]);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.play();
    return () => mixer.stopAllAction();
  }, [cloned, animFBX]);

  // Every frame: advance mixer. On frame 1 also measure & fix scale.
  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);

    if (!scaledRef.current && groupRef.current) {
      const box  = new THREE.Box3().setFromObject(groupRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      if (size.y > 0) {
        // Compute how much to scale the group so its content is TARGET_HEIGHT tall
        const currentScale = groupRef.current.scale.y;
        const worldHeight  = size.y; // already in world units
        const s = (TARGET_HEIGHT / worldHeight) * currentScale;
        groupRef.current.scale.set(s, s, s);
        console.log(`[Guide] raw height=${worldHeight.toFixed(2)} → applied scale=${s.toExponential(3)}`);
        scaledRef.current = true;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = 'es-PE';
    utter.rate  = 0.92;
    utter.pitch = 1.05;
    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <primitive object={cloned} />

      {hovered && (
        <mesh position={[0, TARGET_HEIGHT * 0.5, 0]}>
          <sphereGeometry args={[TARGET_HEIGHT * 0.45, 12, 12]} />
          <meshStandardMaterial color="#ffdd44" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}

      <Html position={[0, TARGET_HEIGHT + 0.5, 0]} center transform sprite style={{ pointerEvents: 'none' }}>
        <div style={{
          background: speaking ? 'rgba(30,150,30,0.93)' : 'rgba(10,10,10,0.78)',
          color: 'white', padding: '6px 14px', borderRadius: '10px',
          fontFamily: 'sans-serif', fontSize: '13px', whiteSpace: 'nowrap',
          border: speaking ? '2px solid #66ff66' : '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', textAlign: 'center', userSelect: 'none',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{title}</div>
          <div style={{ fontSize: '10px', opacity: 0.85 }}>
            {speaking ? '🔊 Hablando… (Click para detener)' : '▶ Click para escuchar'}
          </div>
        </div>
      </Html>
    </group>
  );
}

function GuideFallback() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.25, 1.1, 8, 16]} />
        <meshStandardMaterial color="#886644" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#e0ac82" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function GuideCharacter({ position = [0, 0, 0], rotation = [0, 0, 0], text = '', title = 'Guía' }) {
  const [speaking, setSpeaking] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={<GuideFallback />}>
        <GuideInner
          text={text} title={title}
          speaking={speaking} setSpeaking={setSpeaking}
          hovered={hovered}  setHovered={setHovered}
        />
      </Suspense>
    </group>
  );
}
