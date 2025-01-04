const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    match: [/^1[3-9]\d{9}$/, 'Please enter a valid mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  birthDate: {
    type: Date,
    required: [true, 'Birth date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Birth date cannot be in the future'
    }
  },
  avatarUrl: {
    type: String,
    default: 'default-avatar.png'
  },
  createdBy: {
    type: String,
    default: 'SYSTEM'
  },
  updatedBy: {
    type: String,
    default: 'SYSTEM'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false  // 默认不返回此字段
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true,  // 自动添加 createdAt 和 updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;  // 永远不返回密码
      delete ret.__v;      // 不返回版本号
      if (!ret.isDeleted) {
        delete ret.isDeleted;  // 只在用户被删除时才显示此字段
      }
      return ret;
    }
  }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  // 只在密码被修改时才重新加密
  if (this.isModified('password')) {
    // 使用 MD5 加密
    this.password = crypto.createHash('md5')
      .update(this.password)
      .digest('hex');
  }
  next();
});

// 验证密码
userSchema.methods.comparePassword = async function(password) {
  // 对输入的密码进行加密
  const hashedPassword = crypto.createHash('md5')
    .update(password)
    .digest('hex');
  
  // 打印调试信息
  console.log('Input Password Hash:', hashedPassword);
  console.log('Stored Password Hash:', this.password);
  
  // 比较存储的密码哈希和输入密码的哈希
  return this.password === hashedPassword;
};

// 更新最后登录时间
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  await this.save();
};

// 软删除方法
userSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  await this.save();
};

// 查询中间件：自动排除已删除的用户
userSchema.pre(/^find/, function(next) {
  // 除非明确要求，否则不返回已删除的用户
  if (!this.getQuery().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  delete this.getQuery().includeDeleted;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
