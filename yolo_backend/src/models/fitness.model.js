const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
  // 运动类型
  exerciseType: {
    type: String,
    required: true,
    trim: true
  },
  // 运动人（关联用户）
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 运动日期
  exerciseDate: {
    type: Date,
    required: true
  },
  // 运动耗时（分钟）
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  // 消耗的卡路里
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0
  },
  // 运动强度（可选）：light, moderate, vigorous
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'vigorous'],
    default: 'moderate'
  },
  // 运动地点（可选）
  location: {
    type: String,
    trim: true
  },
  // 创建人
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  // 修改人
  updatedBy: {
    type: String,
    required: true,
    trim: true
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  // 修改时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新修改时间
fitnessSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Fitness = mongoose.model('Fitness', fitnessSchema);

module.exports = Fitness;
