const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'event'],
    required: true
  },
  imageUrl: {
    type: String,
    required: function() {
      return this.type === 'image' || this.type === 'event';
    }
  },
  videoUrl: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);