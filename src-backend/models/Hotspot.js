const mongoose = require('mongoose');

const HotspotSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  description: { es: String, en: String, qu: String },
  position:    { x: Number, y: Number, z: Number },
  arMarker:    { type: String },
  mediaUrl:    { type: String },
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotspot', HotspotSchema);
