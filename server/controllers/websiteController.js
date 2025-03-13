const Website = require('../models/Website');
// Use a CommonJS-compatible approach for generating IDs
const crypto = require('crypto');

// Function to generate a random ID similar to nanoid
const generateRandomId = (length = 10) => {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, length);
};

// Get all websites for a user
exports.getAllWebsites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const websites = await Website.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Website.countDocuments({ user: req.user._id });

    res.json({
      websites,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get website by ID
exports.getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    
    // Check if website belongs to user or is public
    if (website.user.toString() !== req.user._id.toString() && !website.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(website);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create website
exports.createWebsite = async (req, res) => {
  try {
    const { title, description, prompt, htmlCode, cssCode, jsCode, isPublic } = req.body;
    
    // Generate unique shareable link using our custom function
    const shareableLink = generateRandomId(10);

    const website = new Website({
      user: req.user._id,
      title,
      description,
      prompt,
      htmlCode,
      cssCode,
      jsCode: jsCode || '',
      shareableLink,
      isPublic: isPublic || false
    });

    await website.save();
    res.status(201).json(website);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update website
exports.updateWebsite = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    
    // Check if website belongs to user
    if (website.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, htmlCode, cssCode, jsCode, isPublic } = req.body;
    
    website.title = title || website.title;
    website.description = description || website.description;
    website.htmlCode = htmlCode || website.htmlCode;
    website.cssCode = cssCode || website.cssCode;
    website.jsCode = jsCode || website.jsCode;
    website.isPublic = isPublic !== undefined ? isPublic : website.isPublic;

    await website.save();
    res.json(website);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete website
exports.deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    
    // Check if website belongs to user
    if (website.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Website.findByIdAndDelete(req.params.id);
    res.json({ message: 'Website removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get website by shareable link
exports.getWebsiteByShareableLink = async (req, res) => {
  try {
    const website = await Website.findOne({ shareableLink: req.params.shareableLink });
    
    if (!website || !website.isPublic) {
      return res.status(404).json({ message: 'Website not found' });
    }
    
    res.json(website);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search websites
exports.searchWebsites = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const websites = await Website.find({
      user: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Website.countDocuments({
      user: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    });

    res.json({
      websites,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
