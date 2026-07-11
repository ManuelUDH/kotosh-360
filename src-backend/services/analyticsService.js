const Metric = require('../models/Metric');

/**
 * Calcula el índice de compromiso por hotspot (0–100)
 */
async function engagementIndex(hotspotId) {
  const data = await Metric.find({ hotspotId });
  if (!data.length) return 0;
  const interactRate = data.filter(m => m.eventType === 'interaction').length / data.length;
  const avgDwell = data.reduce((s, m) => s + m.dwellTime, 0) / data.length;
  const score = interactRate * 50 + Math.min((avgDwell / 120) * 50, 50);
  return Math.round(score);
}

/**
 * Top 5 horas del día con mayor afluencia
 */
async function peakHours() {
  return Metric.aggregate([
    { $project: { hour: { $hour: '$createdAt' } } },
    { $group:   { _id: '$hour', count: { $sum: 1 } } },
    { $sort:    { count: -1 } },
    { $limit:   5 }
  ]);
}

/**
 * Distribución por idioma
 */
async function languageStats() {
  return Metric.aggregate([
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort:  { count: -1 } }
  ]);
}

module.exports = { engagementIndex, peakHours, languageStats };
