const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Menu title is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Menu code is required'],
    unique: true,
    trim: true
  },
  path: {
    type: String,
    required: [true, 'Menu path is required'],
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    default: ''
  },
  isFolder: {
    type: Boolean,
    default: false
  },
  sort: {
    type: Number,
    default: 1
  },
  createdBy: {
    type: String,
    default: 'SYSTEM'
  },
  updatedBy: {
    type: String,
    default: 'SYSTEM'
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, {
  timestamps: true,  // 自动添加 createdAt 和 updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;      // 不返回版本号
      if (!ret.isDeleted) {
        delete ret.isDeleted;
      }
      return ret;
    }
  }
});

// 查询中间件：自动排除已删除的菜单
menuSchema.pre(/^find/, function(next) {
  if (!this.getQuery().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// 软删除方法
menuSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  return await this.save();
};

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
