const express = require('express');
const router = express.Router();
const { fetchImage } = require('../controllers/imageController');

router.get('/', fetchImage);

module.exports = router;
