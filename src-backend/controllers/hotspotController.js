const mockHotspots = [
  {
    _id: 'manos_cruzadas', name: 'Templo de las Manos Cruzadas',
    description: {
      es: 'El símbolo más icónico de Kotosh, datado ~2000 a.C.',
      en: 'The most iconic symbol of Kotosh, dated ~2000 BC.',
      qu: "Kotosh nisqap rikch'aq siq'i"
    },
    position: { x: 0, y: 0, z: 0 }, arMarker: 'marker_manos'
  },
  {
    _id: 'altar_central', name: 'Altar Central',
    description: {
      es: 'Espacio ceremonial principal del templo.',
      en: 'Main ceremonial space of the temple.',
      qu: "Hatun wak'a"
    },
    position: { x: 5, y: 0, z: 3 }, arMarker: 'marker_altar'
  },
  {
    _id: 'muro_norte', name: 'Muro Norte',
    description: {
      es: 'Muro de adobe original con pigmentación ocre.',
      en: 'Original adobe wall with ochre pigmentation.',
      qu: 'Qello pirqa'
    },
    position: { x: -8, y: 0, z: 0 }, arMarker: 'marker_muro'
  },
  {
    _id: 'entrada_principal', name: 'Entrada Principal',
    description: {
      es: 'Portal de acceso al recinto sagrado.',
      en: 'Main entrance to the sacred precinct.',
      qu: 'Hatun punku'
    },
    position: { x: 0, y: 0, z: -10 }, arMarker: 'marker_entrada'
  }
];

exports.getHotspots = async (req, res) => {
  try {
    res.json({ success: true, data: mockHotspots });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createHotspot = async (req, res) => {
  try {
    const newHotspot = { ...req.body, _id: 'hotspot_' + Date.now() };
    mockHotspots.push(newHotspot);
    res.status(201).json({ success: true, data: newHotspot });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.seedHotspots = async (req, res) => {
  res.json({ success: true, message: 'Hotspots inicializados (mock)', count: mockHotspots.length });
};
