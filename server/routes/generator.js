const express = require('express');
const generatorController = require('../controllers/generatorController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Generate website from prompt
router.post('/generate', generatorController.generateWebsite);

// Get example prompts
router.get('/examples', generatorController.getExamplePrompts);

module.exports = router;
