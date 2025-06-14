const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    title: String,
    description: String
  }],
  image: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);