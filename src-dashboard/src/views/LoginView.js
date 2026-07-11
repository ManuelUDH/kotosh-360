import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LoginView.css';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      // Simulate login for prototype
      localStorage.setItem('kotosh_user', username);
      navigate('/explore');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder={t('loginPlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="login-btn">{t('loginBtn')}</button>
        </form>
        <button onClick={() => navigate('/')} className="back-btn">
          ← {t('backBtn')}
        </button>
      </div>
    </div>
  );
}
