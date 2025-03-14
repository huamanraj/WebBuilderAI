const express = require('express');
const cors = require('cors');
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');
const { corsOptions } = require('../middleware/cors-middleware');

const router = express.Router();

// Explicitly handle OPTIONS requests
router.options('*', cors(corsOptions));

// Public route for shared websites (should be before auth middleware)
router.get('/share/:shareableLink', cors(corsOptions), websiteController.getWebsiteByShareableLink);

// Apply CORS to all routes in this router
router.use(cors(corsOptions));

// All other routes require authentication
router.use(auth);

// CRUD operations
router.get('/', websiteController.getAllWebsites);
router.get('/search', websiteController.searchWebsites);
router.get('/:id', websiteController.getWebsiteById);
router.post('/', websiteController.createWebsite);
router.put('/:id', websiteController.updateWebsite);
router.delete('/:id', websiteController.deleteWebsite);

module.exports = router;
