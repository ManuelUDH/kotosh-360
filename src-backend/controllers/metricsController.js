const mockMetrics = [];

exports.createMetric = async (req, res) => {
  try {
    const newMetric = { ...req.body, _id: 'metric_' + Date.now(), createdAt: new Date() };
    mockMetrics.push(newMetric);
    res.status(201).json({ success: true, data: newMetric });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    res.json({ success: true, count: mockMetrics.length, data: mockMetrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalSessions: 120,
        totalInteractions: 450,
        avgDwellTime: 45.2,
        byHotspot: [
          { _id: 'manos_cruzadas', count: 150 },
          { _id: 'altar_central', count: 120 },
          { _id: 'muro_norte', count: 90 },
          { _id: 'entrada_principal', count: 90 }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
