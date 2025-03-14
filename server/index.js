require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const websiteRoutes = require('./routes/websites');
const generatorRoutes = require('./routes/generator');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Update to handle all possible request paths
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://webbuilder.amanraj.me', 'http://localhost:3000', 'https://web-builder-ai-backend.vercel.app'];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Allow the request to continue despite origin not being in the allowed list
      // This is more permissive but helps with debugging
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400 // 24 hours cache for preflight requests
};

// Vercel-specific middleware to ensure CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://webbuilder.amanraj.me');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Enable pre-flight requests for all routes
app.options('*', (req, res) => {
  res.status(200).end();
});

// Apply standard CORS middleware after custom headers
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Increase request timeout for long-running operations
app.use((req, res, next) => {
  // Set a longer timeout for specific routes
  if (req.path.includes('/api/generator')) {
    req.setTimeout(300000); // 5 minutes for generator routes
    res.setTimeout(300000);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/generator', generatorRoutes);
app.use('/api/images', imageRoutes);

// MongoDB Connection - removed deprecated options
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('******MongoDB connected'))
.catch(err => console.error('*****MongoDB connection error:', err));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler - ensure CORS headers are included in error responses
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Set CORS headers for error responses
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server with port availability check
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1} instead`);
    });
  } else {
    console.error('Server error:', err);
  }
});
