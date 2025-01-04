const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  drinkName: {
    type: String,
    required: true,
    trim: true
  },
  alcoholType: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  drinkTime: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 关联到 User 模型
    required: true
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt 字段
});

const Drink = mongoose.model('Drink', drinkSchema);

module.exports = Drink;
