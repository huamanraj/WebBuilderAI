const express = require('express');
const cors = require('cors');
const generatorController = require('../controllers/generatorController');
const auth = require('../middleware/auth');
const { corsOptions } = require('../middleware/cors-middleware');

const router = express.Router();

// Explicitly handle OPTIONS requests for preflight
router.options('*', cors(corsOptions));

// Apply CORS before anything else
router.use(cors(corsOptions));

// Custom error handling middleware specifically for generator routes
const generatorErrorHandler = (err, req, res, next) => {
  // Ensure CORS headers are present in error responses
  res.header("Access-Control-Allow-Origin", req.headers.origin || corsOptions.origin[0]);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error processing generator request',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

// Apply CORS to the specific generate route with its own error handler
router.post('/generate', 
  cors(corsOptions),  // Apply CORS again at the route level
  (req, res, next) => {
    // Set longer timeout for this endpoint
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);
    
    // Add CORS headers immediately
    res.header("Access-Control-Allow-Origin", req.headers.origin || corsOptions.origin[0]);
    res.header("Access-Control-Allow-Credentials", "true");
    
    next();
  },
  auth,  // Apply auth after CORS is ensured
  generatorController.generateWebsite,
  generatorErrorHandler
);

// Get example prompts with CORS
router.get('/examples', cors(corsOptions), auth, generatorController.getExamplePrompts);

// Apply error handler at router level
router.use(generatorErrorHandler);

module.exports = router;
