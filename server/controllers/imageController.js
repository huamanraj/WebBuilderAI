const axios = require('axios');

exports.fetchImage = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    });

    if (!response.data || !response.data.photos) {
      throw new Error('Invalid response from Pexels API');
    }

    const images = response.data.photos.map(photo => ({
      url: photo.src.large,  // Changed to large size
      alt: photo.alt || photo.photographer || query,
      thumbnail: photo.src.small // Added thumbnail
    }));

    res.json({ images });
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(error.response?.status || 500).json({ 
      message: 'Failed to fetch images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Image service error'
    });
  }
};
