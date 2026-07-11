import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { mobileInput, audioStore, GUIDES } from './mobileStore';


export default function Player() {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const yVelocity = useRef(0);
  const isJumping = useRef(false);
  // Track which guide is currently near (by index, -1 = none)
  const nearGuideRef = useRef(-1);

  useEffect(() => {
    // Spawn at grass level in front of the staircase
    camera.position.set(0, 1.7, 20);
    camera.lookAt(0, 3, 0);
    
    if (mobileInput.isMobile) {
      camera.rotation.order = 'YXZ';
    }

    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp': case 'KeyW': setMoveForward(true); break;
        case 'ArrowLeft': case 'KeyA': setMoveLeft(true); break;
        case 'ArrowDown': case 'KeyS': setMoveBackward(true); break;
        case 'ArrowRight': case 'KeyD': setMoveRight(true); break;
        case 'Space':
          if (!isJumping.current) {
            isJumping.current = true;
            yVelocity.current = 10.5; // Jump force
          }
          break;
        default: break;
      }
    };
    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp': case 'KeyW': setMoveForward(false); break;
        case 'ArrowLeft': case 'KeyA': setMoveLeft(false); break;
        case 'ArrowDown': case 'KeyS': setMoveBackward(false); break;
        case 'ArrowRight': case 'KeyD': setMoveRight(false); break;
        default: break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [camera]);

  useFrame((state, delta) => {
    // Smooth velocity damping
    velocity.current.x -= velocity.current.x * 12.0 * delta;
    velocity.current.z -= velocity.current.z * 12.0 * delta;

    let moveZ = Number(moveForward) - Number(moveBackward);
    let moveX = Number(moveRight) - Number(moveLeft);
    
    if (mobileInput.isMobile) {
      moveX = mobileInput.moveX;
      moveZ = -mobileInput.moveZ;
      
      // Camera Look
      const lookSensitivity = 0.005;
      camera.rotation.y -= mobileInput.lookDx * lookSensitivity;
      camera.rotation.x -= mobileInput.lookDy * lookSensitivity;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      
      mobileInput.lookDx = 0;
      mobileInput.lookDy = 0;
    }

    direction.current.z = moveZ;
    direction.current.x = moveX;
    direction.current.normalize();

    const speed = 1.5;
    if (moveForward || moveBackward || (mobileInput.isMobile && Math.abs(mobileInput.moveZ) > 0.1)) {
      velocity.current.z -= (mobileInput.isMobile ? moveZ : direction.current.z) * speed * delta;
    }
    if (moveLeft || moveRight || (mobileInput.isMobile && Math.abs(mobileInput.moveX) > 0.1)) {
      velocity.current.x -= (mobileInput.isMobile ? moveX : direction.current.x) * speed * delta;
    }

    camera.translateX(-velocity.current.x);
    camera.translateZ(velocity.current.z);

    const x = camera.position.x;
    const z = camera.position.z;
    const pad = 0.6;

    // Temple at position [0, 5.0, -2], walls width=10.5, depth=10.5
    // In world coords: x: -5.25 to 5.25, z: -7.25 to 3.25
    const temMinX = -5.25;
    const temMaxX = 5.25;
    const temMinZ = -7.25;
    const temMaxZ = 3.25;

    const inTemple = x > temMinX + pad && x < temMaxX - pad && z > temMinZ + pad && z < temMaxZ - pad;
    const doorOpen = x > -1.8 && x < 1.8; // door gap in front wall

    if (inTemple) {
      // Side walls
      if (x < temMinX + pad * 2) camera.position.x = temMinX + pad * 2;
      if (x > temMaxX - pad * 2) camera.position.x = temMaxX - pad * 2;
      // Back wall
      if (z < temMinZ + pad * 2) camera.position.z = temMinZ + pad * 2;
      // Front wall (except door gap)
      if (z > temMaxZ - pad * 2 && !doorOpen) camera.position.z = temMaxZ - pad * 2;

      // NOTE: Sunken patio has no hard collision — player walks over it naturally
    } else {
      // Block walking through solid wall from outside
      if (x > temMinX - pad && x < temMinX && z > temMinZ && z < temMaxZ) camera.position.x = temMinX - pad;
      if (x < temMaxX + pad && x > temMaxX && z > temMinZ && z < temMaxZ) camera.position.x = temMaxX + pad;
      if (z > temMinZ - pad && z < temMinZ && x > temMinX && x < temMaxX) camera.position.z = temMinZ - pad;
      if (z < temMaxZ + pad && z > temMaxZ && x > temMinX && x < temMaxX && !doorOpen) camera.position.z = temMaxZ + pad;
    }

    // ── EXTERIOR OBSTACLES COLLISION ──
    const obstacles = [
      // Enclosure A walls (center: -22, 10, approx size: 11x9)
      { minX: -27.5, maxX: -16.5, minZ: 5.5, maxZ: 14.5 },
      // Enclosure B walls (center: 24, 10, approx size: 9x9)
      { minX: 19.5, maxX: 28.5, minZ: 5.5, maxZ: 14.5 },
      // Enclosure C (center: -12, -16, approx size: 8x7)
      { minX: -16, maxX: -8, minZ: -19.5, maxZ: -12.5 },
      // Enclosure D (center: 18, -14, approx size: 11x5)
      { minX: 12.5, maxX: 23.5, minZ: -16.5, maxZ: -11.5 },
      // Low foundation walls
      { minX: -17, maxX: -7, minZ: 17.5, maxZ: 18.5 },
      { minX: 8.5, maxX: 15.5, minZ: 19.5, maxZ: 20.5 },
      { minX: -23, maxX: -17, minZ: 13.5, maxZ: 14.5 },
      { minX: 4, maxX: 12, minZ: -22.5, maxZ: -21.5 },
      { minX: -11, maxX: -5, minZ: -20.5, maxZ: -19.5 },
      // Secondary mound (center: -28, -5, size: 20x15)
      { minX: -38, maxX: -18, minZ: -12.5, maxZ: 2.5 },
      // Main staircase side walls
      { minX: -3.8, maxX: -2.8, minZ: 8.0, maxZ: 18.0 },
      { minX: 2.8, maxX: 3.8, minZ: 8.0, maxZ: 18.0 },
    ];

    obstacles.forEach(obs => {
      if (x > obs.minX - pad && x < obs.maxX + pad && z > obs.minZ - pad && z < obs.maxZ + pad) {
        // Push out to the closest edge
        const dMinX = Math.abs(x - (obs.minX - pad));
        const dMaxX = Math.abs(x - (obs.maxX + pad));
        const dMinZ = Math.abs(z - (obs.minZ - pad));
        const dMaxZ = Math.abs(z - (obs.maxZ + pad));

        const minD = Math.min(dMinX, dMaxX, dMinZ, dMaxZ);
        if (minD === dMinX) camera.position.x = obs.minX - pad;
        else if (minD === dMaxX) camera.position.x = obs.maxX + pad;
        else if (minD === dMinZ) camera.position.z = obs.minZ - pad;
        else if (minD === dMaxZ) camera.position.z = obs.maxZ + pad;
      }
    });

    // ── STAIRCASE (matches new geometry: 10 steps × 0.5m tall × 1.0m deep, 6m wide)
    const STAIR_X_HALF = 3.3;  // half-width
    const STAIR_START_Z = 18.5; // Z where first step begins
    const STAIR_END_Z = 8.5;  // Z where top step ends
    const STEP_DEPTH = 1.0;
    const STEP_HEIGHT = 0.5;
    const NUM_STEPS = 10;

    const onStairsX = x > -STAIR_X_HALF && x < STAIR_X_HALF;
    const onStairsZ = z > STAIR_END_Z && z < STAIR_START_Z;
    const onStairs = onStairsX && onStairsZ;

    if (onStairs) {
      if (x < -STAIR_X_HALF + pad) camera.position.x = -STAIR_X_HALF + pad;
      if (x > STAIR_X_HALF - pad) camera.position.x = STAIR_X_HALF - pad;
    }

    // ── SMOOTH GRAVITY / HEIGHT SYSTEM ──────────────────────────────────────
    let targetY;

    const deepInTemple = x > temMinX + pad * 3 && x < temMaxX - pad * 3 &&
      z > temMinZ + pad * 3 && z < temMaxZ - pad * 3;

    if (deepInTemple) {
      targetY = 5.3 + 1.7; // Temple interior floor

    } else if (onStairs) {
      const rawStep = Math.floor((STAIR_START_Z - z) / STEP_DEPTH);
      const stepIdx = Math.max(0, Math.min(rawStep, NUM_STEPS - 1));
      targetY = (stepIdx + 1) * STEP_HEIGHT + 1.7;

    } else if (x > -9 && x < 9 && z > -6 && z < 8.5) {
      targetY = 5.0 + 1.7;   // Top terrace (extends to meet stairs)

    } else if (x > -13 && x < 13 && z > -9 && z < 9) {
      targetY = 3.0 + 1.7;   // Middle terrace

    } else if (x > -18 && x < 18 && z > -13 && z < 13) {
      targetY = 1.5 + 1.7;   // Base terrace

    } else {
      targetY = 1.7;          // Ground
    }

    // ── APPLY VERTICAL MOVEMENT (Jump Physics or Ground Lerp) ──
    if (isJumping.current) {
      camera.position.y += yVelocity.current * delta;
      yVelocity.current -= 22.0 * delta; // Gravity

      // Check for landing on the ground target
      if (yVelocity.current <= 0 && camera.position.y <= targetY) {
        camera.position.y = targetY;
        isJumping.current = false;
        yVelocity.current = 0;
      }
    } else {
      // Smooth lerp — slightly faster up than down so steps feel snappy
      const lerpSpeed = camera.position.y < targetY ? 14 : 5;
      camera.position.y += (targetY - camera.position.y) * lerpSpeed * delta;
    }

    // ── GUIDE PROXIMITY DETECTION (runs every frame, triggers mobile audio button) ──
    {
      let foundIdx = -1;
      const px = camera.position.x;
      const py = camera.position.y;
      const pz = camera.position.z;
      for (let i = 0; i < GUIDES.length; i++) {
        const g = GUIDES[i];
        const dx = px - g.worldPos[0];
        const dy = py - g.worldPos[1];
        const dz = pz - g.worldPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < g.radius) { foundIdx = i; break; }
      }

      if (foundIdx !== nearGuideRef.current) {
        nearGuideRef.current = foundIdx;
        if (foundIdx >= 0) {
          const g = GUIDES[foundIdx];
          // resolvedText/resolvedTitle/resolvedLang are set by ExploreView when language loads
          audioStore.setGuide(
            g.resolvedText  || g.textKey,
            g.resolvedTitle || g.titleKey,
            g.resolvedLang  || 'es-PE'
          );
        } else if (!audioStore.speaking) {
          audioStore.clearGuide();
        }
      }
    }
  });

  return mobileInput.isMobile ? null : <PointerLockControls />;
}
