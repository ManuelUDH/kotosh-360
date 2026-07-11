import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { to: '/',         label: '🏛️  Resumen'   },
  { to: '/hotspots', label: '📍 Hotspots'  },
  { to: '/metrics',  label: '📊 Métricas'  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🏺</span>
        <span className="brand-name">Kotosh 360</span>
      </div>
      <nav>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">v1.0.0 — Huánuco, Perú</div>
    </aside>
  );
}
