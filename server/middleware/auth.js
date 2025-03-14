const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      const error = new Error('Authentication required');
      error.status = 401;
      throw error;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 401;
      throw error;
    }
    
    req.user = user;
    next();
  } catch (error) {
    // Ensure CORS headers are present even in error responses
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    
    res.status(error.status || 401).json({ 
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = auth;
