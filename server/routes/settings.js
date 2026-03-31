const express = require('express');
const router = express.Router();

const { updateSettings } = require('../controllers/settingsController');

// PUT: update queue settings
router.put('/queue/:id/settings', updateSettings);

module.exports = router;