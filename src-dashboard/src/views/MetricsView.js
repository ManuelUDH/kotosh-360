import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './Views.css';

const langData = [
  { name: 'Español', value: 74 },
  { name: 'Inglés',  value: 18 },
  { name: 'Quechua', value: 8  },
];
const COLORS = ['#c9a84c', '#7c5cbf', '#4ade80'];

const eventData = [
  { type: 'Scan',          count: 3571 },
  { type: 'View',          count: 2890 },
  { type: 'Interacción',   count: 1430 },
  { type: 'Compartir',     count: 312  },
];

export default function MetricsView() {
  return (
    <div>
      <h1 className="page-title">Métricas de Impacto</h1>
      <p className="page-sub">Análisis del comportamiento e interacción turística</p>

      <div className="charts-row">
        <div className="chart-box">
          <h2 className="chart-title">Distribución por idioma</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name} ${value}%`}>
                {langData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2e3145' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2 className="chart-title">Eventos por tipo</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={eventData} layout="vertical">
              <XAxis type="number" stroke="#8888aa" />
              <YAxis type="category" dataKey="type" stroke="#8888aa" width={90} />
              <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2e3145' }} />
              <Bar dataKey="count" fill="#7c5cbf" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box" style={{ marginTop: 24 }}>
        <h2 className="chart-title">Registro de eventos recientes (simulado)</h2>
        <table className="metrics-table">
          <thead><tr><th>Sesión</th><th>Hotspot</th><th>Evento</th><th>Idioma</th><th>Permanencia</th></tr></thead>
          <tbody>
            {[
              ['sess_a9f2','manos_cruzadas','interaction','es','8 min'],
              ['sess_b3c1','altar_central','scan','en','3 min'],
              ['sess_d7e8','muro_norte','view','qu','5 min'],
              ['sess_f1a4','manos_cruzadas','share','es','12 min'],
              ['sess_g5h0','entrada_principal','scan','en','2 min'],
            ].map(([s,h,e,l,t]) => (
              <tr key={s}>
                <td><code>{s}</code></td><td>{h}</td><td>{e}</td><td>{l}</td><td>{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
