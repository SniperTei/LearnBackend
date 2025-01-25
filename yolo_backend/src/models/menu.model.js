const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '菜单标题不能为空'],
    trim: true
  },
  code: {
    type: String,
    required: [true, '菜单编码不能为空'],
    unique: true,
    trim: true
  },
  path: {
    type: String,
    required: [true, '菜单路径不能为空'],
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  parentCode: {
    type: String,
    default: null,
    trim: true
  },
  sort: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  isFolder: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, {
  timestamps: true,  
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;      
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

// 添加索引
menuSchema.index({ code: 1 }, { unique: true });
menuSchema.index({ parentCode: 1 });
menuSchema.index({ sort: 1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
