import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';
import './Views.css';

const weekData = [
  { day: 'Lun', visits: 38 }, { day: 'Mar', visits: 52 },
  { day: 'Mié', visits: 61 }, { day: 'Jue', visits: 45 },
  { day: 'Vie', visits: 70 }, { day: 'Sáb', visits: 95 },
  { day: 'Dom', visits: 88 },
];

const dwellData = [
  { hour: '8h',  avg: 1.2 }, { hour: '10h', avg: 3.8 },
  { hour: '12h', avg: 5.1 }, { hour: '14h', avg: 4.6 },
  { hour: '16h', avg: 6.2 }, { hour: '18h', avg: 2.9 },
];

export default function OverviewView() {
  return (
    <div>
      <h1 className="page-title">Resumen General</h1>
      <p className="page-sub">Complejo Arqueológico de Kotosh — Huánuco, Perú</p>

      <div className="stats-grid">
        <StatCard icon="👤" label="Sesiones únicas" value="1,248" sub="↑ 12% vs semana anterior" />
        <StatCard icon="🔍" label="Scans AR realizados" value="3,571" sub="Promedio: 2.8 por visita" />
        <StatCard icon="⏱️" label="Tiempo promedio" value="6.4 min" sub="Por hotspot activo" />
        <StatCard icon="🌐" label="Idioma más usado" value="ES" sub="74% de sesiones" />
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h2 className="chart-title">Visitas por día (última semana)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData}>
              <XAxis dataKey="day" stroke="#8888aa" />
              <YAxis stroke="#8888aa" />
              <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2e3145' }} />
              <Bar dataKey="visits" fill="#c9a84c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2 className="chart-title">Tiempo de permanencia promedio (min)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dwellData}>
              <XAxis dataKey="hour" stroke="#8888aa" />
              <YAxis stroke="#8888aa" />
              <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2e3145' }} />
              <Line type="monotone" dataKey="avg" stroke="#7c5cbf" strokeWidth={2} dot={{ fill: '#7c5cbf' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
