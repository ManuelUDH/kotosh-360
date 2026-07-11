const router = require('express').Router();
const { getHotspots, createHotspot, seedHotspots } = require('../controllers/hotspotController');

router.get('/',       getHotspots);
router.post('/',      createHotspot);
router.post('/seed',  seedHotspots);

module.exports = router;
