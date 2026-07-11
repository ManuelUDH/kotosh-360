import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LandingView.css';

export default function LandingView() {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  // Pre-load the 3D model resources in the background for a smoother transition later
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = '/models/scene.gltf';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="landing-container">
      {/* Dynamic Background */}
      <div 
        className="landing-background" 
        style={{ backgroundImage: `url('/textures/adobe.png')` }}
      >
        <div className="gradient-overlay"></div>
      </div>

      <div className="landing-content">
        {/* Header / Language Selector */}
        <header className="landing-header">
          <div className="logo-placeholder">🏛️</div>
          <div className="lang-selector">
            <label htmlFor="lang-select">{t('selectLanguage')}</label>
            <select 
              id="lang-select" 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="glass-select"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
              <option value="qu">Quechua (Huánuco)</option>
              <option value="ay">Aymara</option>
            </select>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">{t('title')}</h1>
          <p className="hero-subtitle">{t('subtitle')}</p>
          
          <button 
            className="try-now-btn" 
            onClick={() => navigate('/login')}
          >
            {t('tryNow')}
            <span className="btn-glow"></span>
          </button>
        </section>

        {/* Information Grid */}
        <section className="info-grid">
          <div className="info-card glass-panel">
            <div className="info-icon">👥</div>
            <h2>{t('aboutUsTitle')}</h2>
            <p>{t('aboutUsText')}</p>
          </div>

          <div className="info-card glass-panel">
            <div className="info-icon">🧭</div>
            <h2>{t('aboutProjTitle')}</h2>
            <p>{t('aboutProjText')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
