const express = require('express');
const router = express.Router();
const cors = require('cors');
const { fetchImage } = require('../controllers/imageController');

// Open CORS configuration for image routes only
const openCorsConfig = {
  origin: '*', // Allow requests from any origin
  methods: ['GET'],
  maxAge: 86400 // 24 hours
};

// Apply open CORS specifically to image routes
router.get('/', cors(openCorsConfig), fetchImage);

module.exports = router;
