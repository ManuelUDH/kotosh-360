const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  sessionId:  { type: String, required: true },
  userId:     { type: String, default: 'anonymous' },
  hotspotId:  { type: String, required: true },
  eventType:  { type: String, enum: ['scan','view','interaction','share'], required: true },
  dwellTime:  { type: Number, default: 0 },   // segundos
  language:   { type: String, default: 'es' },
  device:     { type: String, default: 'mobile' },
  createdAt:  { type: Date,   default: Date.now }
});

module.exports = mongoose.model('Metric', MetricSchema);
