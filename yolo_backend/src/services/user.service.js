const UserDAL = require('../dal/user.dal');
const { generateToken } = require('../utils/jwt');
const Permission = require('../models/permission.model');
const Menu = require('../models/menu.model');
const mongoose = require('mongoose');

class UserService {
  constructor() {
    this.userDAL = new UserDAL();
  }

  /**
   * 用户注册
   */
  async register(userData) {
    const existingUser = await this.userDAL.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Create user
    const user = await this.userDAL.create(userData);

    // Get all menu codes
    const allMenus = await Menu.find({}, 'code');
    const allMenuCodes = allMenus.map(menu => menu.code);

    // Create default permissions
    const defaultPermissions = {
      userId: user._id,
      username: user.username,
      menuCodes: allMenuCodes,
      isAdmin: false,
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM'
    };
    await Permission.create(defaultPermissions);

    // Generate token
    const token = generateToken(user._id, user.isAdmin, user.username);
    
    return { 
      user: this._formatUser(user), 
      token 
    };
  }

  /**
   * 用户登录
   */
  async login(username, password) {
    // Get the original Mongoose document
    const user = await this.userDAL.findByUsername(username);
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }

    // 直接比较客户端传来的 md5 加密密码
    if (user.password !== password) {
      throw new Error('Invalid login credentials');
    }
    // 打印
    console.log('user:', user);
    console.log('user._id:', user._id);
    
    // Get user permissions using proper ObjectId
    const userId = user._id.toString();
    console.log('Looking for permissions with userId:', userId);
    
    // Try to find permission with exact string match on userId
    let permissions = await Permission.findOne({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId) },
        { userId: userId }
      ]
    });
    console.log('Permissions query result:', permissions);
    
    if (!permissions) {
      // Create new permissions if none exist
      console.log('No permissions found, creating new one...');
      const allMenus = await Menu.find({}, 'code');
      const allMenuCodes = allMenus.map(menu => menu.code);
      
      permissions = await Permission.create({
        userId: new mongoose.Types.ObjectId(userId),
        username: user.username,
        menuCodes: allMenuCodes,
        isAdmin: false,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM'
      });
    }

    // Update last login time
    await user.updateLastLogin();

    const token = generateToken(user._id, user.isAdmin, user.username);
    return { 
      user: this._formatUser(user),
      permissions,
      token 
    };
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId) {
    console.log('Finding user by ID:', userId);
    const user = await this.userDAL.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      throw new Error('User not found');
    }
    return this._formatUser(user);
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username) {
    const user = await this.userDAL.findByUsername(username);
    return user ? this._formatUser(user) : null;
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId, updateData) {
    const user = await this.userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user fields
    Object.assign(user, updateData);
    const updatedUser = await user.save();
    
    return this._formatUser(updatedUser);
  }

  /**
   * 删除用户
   */
  async deleteUser(userId, hardDelete = false) {
    const user = await this.userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const deletedUser = hardDelete 
      ? await this.userDAL.hardDelete(userId)
      : await this.userDAL.softDelete(userId);

    // Delete user permissions
    await Permission.deleteOne({ userId: user._id });

    return this._formatUser(deletedUser);
  }

  /**
   * 格式化用户数据，将_id转换为userId
   * @private
   */
  _formatUser(user) {
    if (!user) return null;

    const userObj = user.toObject ? user.toObject() : user;
    const { _id, ...rest } = userObj;

    return {
      userId: _id.toString(),
      ...rest
    };
  }
}

module.exports = UserService;
