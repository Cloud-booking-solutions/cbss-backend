const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true,
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);