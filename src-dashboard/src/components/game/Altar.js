import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Altar({ position }) {
  const fireLight = useRef();

  useFrame(({ clock }) => {
    // Make the fire light flicker
    if (fireLight.current) {
      fireLight.current.intensity = 1.5 + Math.sin(clock.elapsedTime * 10) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base of the altar */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 1, 32]} />
        <meshStandardMaterial color="#5a4e3a" roughness={0.9} />
      </mesh>
      
      {/* Central pit */}
      <mesh position={[0, 1.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#1a110a" />
      </mesh>

      {/* Fire Light */}
      <pointLight ref={fireLight} position={[0, 1.5, 0]} distance={15} color="#ff8800" castShadow />
      
      {/* Fire Core */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
    </group>
  );
}
