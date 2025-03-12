const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  prompt: {
    type: String,
    required: true
  },
  htmlCode: {
    type: String,
    required: true
  },
  cssCode: {
    type: String,
    required: true
  },
  jsCode: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  shareableLink: {
    type: String,
    unique: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Website', WebsiteSchema);
