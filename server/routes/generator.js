const express = require('express');
const cors = require('cors');
const generatorController = require('../controllers/generatorController');
const auth = require('../middleware/auth');

const router = express.Router();

// CORS options for generator routes
const generatorCorsOptions = {
  origin: ['https://webbuilder.amanraj.me', 'http://localhost:3000', 'https://web-builder-ai-backend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  maxAge: 86400, // 24 hours
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization']
};

// Explicitly handle OPTIONS requests for preflight
router.options('*', cors(generatorCorsOptions));

// Apply CORS before auth middleware
router.use(cors(generatorCorsOptions));

// Apply auth after CORS
router.use(auth);

// Error handler middleware for generator routes
const generatorErrorHandler = (err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error processing generator request',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

// Generate website from prompt with increased timeout
router.post('/generate', (req, res, next) => {
  // Set longer timeout for this specific endpoint
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);
  next();
}, generatorController.generateWebsite, generatorErrorHandler);

// Get example prompts
router.get('/examples', generatorController.getExamplePrompts);

module.exports = router;
