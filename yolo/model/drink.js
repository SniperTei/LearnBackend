const mongoose = require('mongoose');

// drinker_username,drink_date,drink_location,alcohol_id,drink_amount,drink_unit
const drink = new mongoose.Schema({
  drinker_username: {
    type: String,
    required: true,
  },
  drink_date: {
    type: Date,
    required: true,
  },
  drink_location: {
    type: String,
    required: true,
  },
  alcohol_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alcohol',
    required: true,
  },
  drink_amount: {
    type: Number,
    required: true,
  },
  drink_unit: {
    type: String,
    required: true,
  },
});

// 输出模型
module.exports = mongoose.model('Drink', drink, 'drink');