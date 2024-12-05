const mongoose = require('mongoose');

// alcohol_name,alcohol_type,alcohol_subtype,nan_rating,nan_review
const alcohol = new mongoose.Schema({
  alcohol_name: {
    type: String,
    required: true,
  },
  alcohol_type: {
    type: String,
    required: true,
  },
  alcohol_subtype: {
    type: String,
    required: true,
  },
  nan_rating: {
    type: Number,
    required: true,
  },
  nan_review: {
    type: String,
    required: true,
  },
});

// 输出模型
module.exports = mongoose.model('Alcohol', alcohol, 'alcohol');