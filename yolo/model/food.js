const mongoose = require('mongoose');

const food = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  recipe: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

// 输出模型
module.exports = mongoose.model('Food', food, 'food');