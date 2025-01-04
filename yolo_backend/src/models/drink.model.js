const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
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
  },
  alcoholId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alcohol',
    required: true
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt 字段
});

// 在查询时自动填充 alcohol 信息
drinkSchema.pre('find', function() {
  this.populate('alcoholId');
});

drinkSchema.pre('findOne', function() {
  this.populate('alcoholId');
});

const Drink = mongoose.model('Drink', drinkSchema);

module.exports = Drink;
