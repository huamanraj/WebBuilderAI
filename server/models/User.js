const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  promptsUsedToday: {
    type: Number,
    default: 0
  },
  promptsResetDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has reached daily prompt limit
UserSchema.methods.hasReachedPromptLimit = function() {
  const now = new Date();
  const resetDate = new Date(this.promptsResetDate);
  
  // Reset count if it's a new day
  if (now.getDate() !== resetDate.getDate() || 
      now.getMonth() !== resetDate.getMonth() || 
      now.getFullYear() !== resetDate.getFullYear()) {
    this.promptsUsedToday = 0;
    this.promptsResetDate = now;
  }
  
  return this.promptsUsedToday >= 2;
};

module.exports = mongoose.model('User', UserSchema);
