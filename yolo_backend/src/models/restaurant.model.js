const mongoose = require('mongoose');

// 定义价位枚举
const PriceLevelEnum = {
  SUPER_EXPENSIVE: 'super_expensive', // 爆贵
  EXPENSIVE: 'expensive',       // 很贵
  MODERATE: 'moderate',        // 正常
  CHEAP: 'cheap'              // 便宜
};

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  imageUrls: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  priceLevel: {
    type: String,
    required: true,
    enum: Object.values(PriceLevelEnum),
    default: PriceLevelEnum.MODERATE
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true, // 自动管理 createdAt 和 updatedAt
  versionKey: false
});

// 创建索引
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ priceLevel: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// 导出模型和价位枚举
module.exports = {
  Restaurant,
  PriceLevelEnum
};
