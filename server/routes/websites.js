const express = require('express');
const cors = require('cors');
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');

const router = express.Router();

// CORS options for websites routes
const websitesCorsOptions = {
  origin: ['https://webbuilder.amanraj.me', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

// Public route for shared websites (should be before auth middleware)
router.get('/share/:shareableLink', cors(websitesCorsOptions), websiteController.getWebsiteByShareableLink);

// All other routes require authentication
router.use(auth);

// CRUD operations with CORS
router.get('/', cors(websitesCorsOptions), websiteController.getAllWebsites);
router.get('/search', cors(websitesCorsOptions), websiteController.searchWebsites);
router.get('/:id', cors(websitesCorsOptions), websiteController.getWebsiteById);
router.post('/', cors(websitesCorsOptions), websiteController.createWebsite);
router.put('/:id', cors(websitesCorsOptions), websiteController.updateWebsite);
router.delete('/:id', cors(websitesCorsOptions), websiteController.deleteWebsite);

module.exports = router;
