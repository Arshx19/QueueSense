const express = require('express');
const router = express.Router();

// import controller
const { updateSettings } = require('../controllers/settingsController');

// route
router.put('/queue/:id/settings', updateSettings);

module.exports = router;