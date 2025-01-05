const mongoose = require('mongoose');

const foodMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '菜品名称不能为空'],
    trim: true
  },
  type: {
    type: String,
    required: [true, '菜品类型不能为空'],
    enum: ['vegetarian', 'meat', 'cold_dish', 'soup', 'side_dish', 'staple_food', 'diet_food'],
    message: '{VALUE} 不是有效的菜品类型'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, '价格不能为空'],
    min: [0, '价格不能小于0']
  },
  chef: {
    type: String,
    trim: true
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

// 添加索引以提高查询性能
foodMenuSchema.index({ name: 1 });
foodMenuSchema.index({ type: 1 });
foodMenuSchema.index({ price: 1 });
foodMenuSchema.index({ chef: 1 });

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);

module.exports = FoodMenu;
