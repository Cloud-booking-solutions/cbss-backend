const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['expert', 'intern'],
    default: 'expert'
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);