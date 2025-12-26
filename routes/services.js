const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const auth = require('../middleware/auth');

// Public
router.get('/', serviceController.getAllServices);

// Admin only (add role check if needed)
router.post('/', auth, serviceController.createService);

module.exports = router;
