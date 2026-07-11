const router = require('express').Router();
const { createMetric, getMetrics, getSummary } = require('../controllers/metricsController');

router.post('/',        createMetric);
router.get('/',         getMetrics);
router.get('/summary',  getSummary);

module.exports = router;
