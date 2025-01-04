const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  group: {
    type: String,
    required: true,
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
});

// 在保存时更新 updatedAt 字段
dictionarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports = Dictionary;
