const mongoose = require('mongoose');

const alcoholType = new mongoose.Schema({
  alcohol_type: {
    type: String,
    required: true,
  },
  alcohol_subtype: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('AlcoholType', alcoholType, 'alcohol_type');