const cors = require('cors');

// Base CORS configuration
const corsOptions = {
  origin: [
    'https://webbuilder.amanraj.me', 
    'http://localhost:3000',
    'https://web-builder-ai-backend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400 // 24 hours cache for preflight requests
};

// Standard CORS middleware
const corsMiddleware = cors(corsOptions);

// CORS error handler to ensure headers are set even during errors
const corsErrorHandler = (err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || corsOptions.origin[0]);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Continue to the next error handler
  next(err);
};

module.exports = {
  corsOptions,
  corsMiddleware,
  corsErrorHandler
};
