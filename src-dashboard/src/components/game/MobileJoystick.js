import React, { useState, useEffect, useRef } from 'react';
import { mobileInput } from './mobileStore';
import './MobileJoystick.css';

export default function MobileJoystick() {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [joystickOrigin, setJoystickOrigin] = useState({ x: 0, y: 0 });
  const touchLeftId = useRef(null);
  const touchRightId = useRef(null);
  const prevRightTouch = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.clientX < window.innerWidth / 2) {
        // Left side: movement
        if (touchLeftId.current === null) {
          touchLeftId.current = touch.identifier;
          setJoystickActive(true);
          setJoystickOrigin({ x: touch.clientX, y: touch.clientY });
          setJoystickPos({ x: touch.clientX, y: touch.clientY });
        }
      } else {
        // Right side: look
        if (touchRightId.current === null) {
          touchRightId.current = touch.identifier;
          prevRightTouch.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    }
  };

  const handleTouchMove = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      
      if (touch.identifier === touchLeftId.current) {
        // Calculate movement vector
        const maxRadius = 50;
        let dx = touch.clientX - joystickOrigin.x;
        let dy = touch.clientY - joystickOrigin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > maxRadius) {
          dx = (dx / distance) * maxRadius;
          dy = (dy / distance) * maxRadius;
        }
        
        setJoystickPos({ x: joystickOrigin.x + dx, y: joystickOrigin.y + dy });
        
        // Normalize for store (-1 to 1)
        mobileInput.moveX = dx / maxRadius;
        mobileInput.moveZ = dy / maxRadius; // Z is forward/back
        
      } else if (touch.identifier === touchRightId.current) {
        // Calculate look delta
        const dx = touch.clientX - prevRightTouch.current.x;
        const dy = touch.clientY - prevRightTouch.current.y;
        
        mobileInput.lookDx += dx;
        mobileInput.lookDy += dy;
        
        prevRightTouch.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      
      if (touch.identifier === touchLeftId.current) {
        touchLeftId.current = null;
        setJoystickActive(false);
        mobileInput.moveX = 0;
        mobileInput.moveZ = 0;
      } else if (touch.identifier === touchRightId.current) {
        touchRightId.current = null;
      }
    }
  };

  if (!mobileInput.isMobile) return null;

  return (
    <div 
      className="mobile-controls-overlay"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="mobile-hint mobile-hint-left">🕹️ Mover</div>
      <div className="mobile-hint mobile-hint-right">👁️ Mirar</div>
      
      {joystickActive && (
        <div 
          className="joystick-base" 
          style={{ left: joystickOrigin.x - 50, top: joystickOrigin.y - 50 }}
        >
          <div 
            className="joystick-thumb" 
            style={{ 
              transform: `translate(${joystickPos.x - joystickOrigin.x}px, ${joystickPos.y - joystickOrigin.y}px)` 
            }}
          />
        </div>
      )}
    </div>
  );
}
