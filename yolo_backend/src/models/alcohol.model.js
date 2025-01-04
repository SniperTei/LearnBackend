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
    enum: ['beer', 'baijiu', 'red_wine', 'foreign_wine', 'sake', 'shochu'],
    default: 'beer'
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  alcoholContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  volume: {
    type: Number,
    required: true,
    min: 0
  },
  volumeUnit: {
    type: String,
    required: true,
    enum: ['ml', 'L'],
    default: 'ml'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 更新 updatedAt 字段
alcoholSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Alcohol = mongoose.model('Alcohol', alcoholSchema);

module.exports = Alcohol;
