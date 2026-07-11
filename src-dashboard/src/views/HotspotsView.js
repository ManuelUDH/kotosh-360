import React, { useState } from 'react';
import './Views.css';

const HOTSPOTS = [
  { id: 'manos_cruzadas', name: 'Templo de las Manos Cruzadas', scans: 1240, engagement: 88, active: true },
  { id: 'altar_central',  name: 'Altar Central',                scans: 980,  engagement: 74, active: true },
  { id: 'muro_norte',     name: 'Muro Norte',                   scans: 651,  engagement: 61, active: true },
  { id: 'entrada_principal', name: 'Entrada Principal',         scans: 700,  engagement: 55, active: true },
];

export default function HotspotsView() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 className="page-title">Hotspots AR</h1>
      <p className="page-sub">Puntos de interacción activos en el sitio arqueológico</p>

      <div className="hotspot-grid">
        {HOTSPOTS.map(h => (
          <div
            key={h.id}
            className={'hotspot-card' + (selected === h.id ? ' selected' : '')}
            onClick={() => setSelected(h.id === selected ? null : h.id)}
          >
            <div className="hs-name">{h.name}</div>
            <div className="hs-stats">
              <span>🔍 {h.scans.toLocaleString()} scans</span>
              <span className="hs-eng" style={{ color: h.engagement > 75 ? '#4ade80' : '#c9a84c' }}>
                ⚡ {h.engagement}% engagement
              </span>
            </div>
            <div className={'hs-badge ' + (h.active ? 'active' : 'inactive')}>
              {h.active ? 'Activo' : 'Inactivo'}
            </div>
            {selected === h.id && (
              <div className="hs-detail">
                <p>Marker ID: <code>{h.id}</code></p>
                <p>Estado: Publicado y trackeando</p>
                <p>Idiomas disponibles: ES · EN · QU</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
