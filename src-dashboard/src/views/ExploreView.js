import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Player from '../components/game/Player';
import TempleScene from '../components/game/TempleScene';
import MobileJoystick from '../components/game/MobileJoystick';
import { audioStore, GUIDES } from '../components/game/mobileStore';
import './ExploreView.css';

export default function ExploreView() {
  const [username, setUsername] = useState('');
  const [locked, setLocked] = useState(false);
  // ── Mobile audio button state (synced with audioStore) ──
  const [guideAudio, setGuideAudio] = useState({ activeText: null, activeTitle: null, voiceLang: 'es-PE', speaking: false });
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const user = localStorage.getItem('kotosh_user');
    if (!user) {
      navigate('/login');
    } else {
      setUsername(user);
    }
  }, [navigate]);

  // Populate GUIDES resolved texts whenever language changes
  // (Player reads these in useFrame to activate the audio button)
  useEffect(() => {
    GUIDES.forEach(g => {
      g.resolvedText  = t(g.textKey);
      g.resolvedTitle = t(g.titleKey);
      g.resolvedLang  = t('voiceLang');
    });
  }, [t]);

  // Subscribe to audioStore changes
  useEffect(() => {
    const unsub = audioStore.subscribe((state) => {
      setGuideAudio({ ...state });
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleLock = () => setLocked(true);
    const handleUnlock = () => setLocked(false);
    document.addEventListener('pointerlockchange', handleLock);
    document.addEventListener('pointerlockchange', handleUnlock);
    return () => {
      document.removeEventListener('pointerlockchange', handleLock);
      document.removeEventListener('pointerlockchange', handleUnlock);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Mobile audio button handler — called from a real DOM button (works on iOS/Android)
  const handleMobileAudio = () => {
    if (guideAudio.speaking) {
      window.speechSynthesis.cancel();
      audioStore.setSpeaking(false);
      return;
    }
    if (!guideAudio.activeText) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(guideAudio.activeText);
    utter.lang  = guideAudio.voiceLang || 'es-PE';
    utter.rate  = 0.92;
    utter.pitch = 1.0;
    utter.onstart = () => audioStore.setSpeaking(true);
    utter.onend   = () => audioStore.setSpeaking(false);
    utter.onerror = () => audioStore.setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="explore-container">
      <MobileJoystick />

      {/* ── MOBILE AUDIO BUTTON (HTML overlay, always accessible from DOM) ── */}
      {guideAudio.activeText && (
        <button
          id="mobile-audio-btn"
          className={`mobile-audio-btn ${guideAudio.speaking ? 'speaking' : ''}`}
          onClick={handleMobileAudio}
          aria-label={guideAudio.speaking ? 'Detener audio' : 'Escuchar guía'}
        >
          <span className="mobile-audio-icon">{guideAudio.speaking ? '⏹' : '🔊'}</span>
          <span className="mobile-audio-label">
            {guideAudio.speaking ? 'Detener' : guideAudio.activeTitle || 'Escuchar'}
          </span>
        </button>
      )}

      {/* HUD overlay */}
      <div className="hud" style={{ pointerEvents: 'none' }}>
        <div className="hud-header">
          <h2>⛩️ {t('subtitle')}</h2>
          <p>{t('touristLabel')} <span>{username}</span></p>
        </div>

        {locked && (
          <div className="hud-compass">
            <span>Kotosh · ~2000 a.C.</span>
          </div>
        )}

        <button
          className="hud-exit"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (document.pointerLockElement) {
              document.exitPointerLock();
            }
            setTimeout(() => navigate('/'), 100);
          }}
        >
          ← {t('exitBtn')}
        </button>
      </div>

      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.0 }}
        camera={{ fov: 72, near: 0.1, far: 500 }}
      >
        {/* Sky */}
        <Sky
          sunPosition={[80, 30, 60]}
          turbidity={2.5}
          rayleigh={1.2}
          mieCoefficient={0.003}
          mieDirectionalG={0.8}
          inclination={0.48}
          azimuth={0.22}
        />

        {/* Fog */}
        <fog attach="fog" args={['#b8d0e0', 80, 260]} />

        {/* Main sun */}
        <directionalLight
          position={[80, 60, 40]}
          intensity={2.0}
          color="#fff5d8"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.5}
          shadow-camera-far={300}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.0005}
        />

        {/* Ambient - Increased intensity so interior is not too dark */}
        <ambientLight intensity={1.2} color="#c8d8f0" />

        {/* Ground bounce */}
        <hemisphereLight skyColor="#b0c8e8" groundColor="#a0885c" intensity={0.8} />

        <Suspense fallback={null}>
          <TempleScene />
        </Suspense>
        <Player />
      </Canvas>
    </div>
  );
}
