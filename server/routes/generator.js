const express = require('express');
const cors = require('cors');
const generatorController = require('../controllers/generatorController');
const auth = require('../middleware/auth');

const router = express.Router();

// CORS options for generator routes
const generatorCorsOptions = {
  origin: ['https://webbuilder.amanraj.me', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

// Apply CORS and auth middleware
router.use(cors(generatorCorsOptions));
router.use(auth);

// Generate website from prompt
router.post('/generate', generatorController.generateWebsite);

// Get example prompts
router.get('/examples', generatorController.getExamplePrompts);

module.exports = router;
