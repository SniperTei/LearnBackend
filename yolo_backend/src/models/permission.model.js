const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  // 关联用户
  username: {
    type: String,
    required: [true, 'Username is required'],
    ref: 'User',
    unique: true // 每个用户只能有一条权限记录
  },
  
  // 菜单权限列表
  menuCodes: [{
    type: String,
    ref: 'Menu'
  }],

  // 是否被删除
  isDeleted: {
    type: Boolean,
    default: false,
    select: false  // 默认不返回此字段
  },

  // 审计字段
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
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

// 查询中间件：自动排除已删除的权限记录
permissionSchema.pre(/^find/, function(next) {
  if (!this.getQuery().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// 软删除方法
permissionSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  return await this.save();
};

// 添加菜单权限
permissionSchema.methods.addMenuCodes = async function(menuCodes) {
  // 确保没有重复的菜单代码
  const uniqueCodes = [...new Set([...this.menuCodes, ...menuCodes])];
  this.menuCodes = uniqueCodes;
  return await this.save();
};

// 移除菜单权限
permissionSchema.methods.removeMenuCodes = async function(menuCodes) {
  this.menuCodes = this.menuCodes.filter(code => !menuCodes.includes(code));
  return await this.save();
};

// 检查是否有特定菜单的权限
permissionSchema.methods.hasMenuPermission = function(menuCode) {
  return this.menuCodes.includes(menuCode);
};

// 检查是否有多个菜单的权限
permissionSchema.methods.hasMenuPermissions = function(menuCodes) {
  return menuCodes.every(code => this.menuCodes.includes(code));
};

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
