const mongoose = require('mongoose');

const alcoholSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 在保存时更新 updatedAt 字段
alcoholSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Alcohol = mongoose.model('Alcohol', alcoholSchema);

module.exports = Alcohol;
