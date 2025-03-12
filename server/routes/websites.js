const express = require('express');
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route for shared websites (should be before auth middleware)
router.get('/share/:shareableLink', websiteController.getWebsiteByShareableLink);

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
