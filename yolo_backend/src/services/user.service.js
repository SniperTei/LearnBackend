const UserDAL = require('../dal/user.dal');
const { generateToken } = require('../utils/jwt');
const Permission = require('../models/permission.model');
const Menu = require('../models/menu.model');
const mongoose = require('mongoose');
const User = require('../models/user.model');

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
    console.log('userData:', userData);
    // Create user
    const user = await this.userDAL.create(userData);
    console.log('create user:', user);

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
   * 获取用户列表
   * @param {Object} filters - 过滤条件
   * @param {Object} options - 分页选项
   * @returns {Promise<{users: Array, pagination: Object}>}
   */
  async listUsers(filters, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    
    // 添加未删除条件
    const query = { ...filters, isDeleted: false };

    // 执行查询
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    // 构建分页信息
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    // 格式化用户数据
    const formattedUsers = users.map(user => this._formatUser(user));

    return { users: formattedUsers, pagination };
  }

  /**
   * 更新用户菜单权限
   * @param {string} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>}
   */
  async updateUserMenus(userId, { menuCodes, isAdmin }) {
    // 验证用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新用户管理员状态
    if (typeof isAdmin === 'boolean') {
      user.isAdmin = isAdmin;
      await user.save();
    }

    // 更新权限记录
    let permission = await Permission.findOne({ userId });
    if (!permission) {
      // 如果没有权限记录，创建新的
      permission = new Permission({
        userId,
        username: user.username,
        menuCodes: [],
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM'
      });
    }

    // 更新菜单权限
    if (Array.isArray(menuCodes)) {
      permission.menuCodes = menuCodes;
      permission.updatedBy = 'SYSTEM';
      await permission.save();
    }

    return {
      userId,
      username: user.username,
      isAdmin: user.isAdmin,
      menuCodes: permission.menuCodes
    };
  }

  /**
   * 获取用户菜单权限
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>}
   */
  async getUserMenus(userId) {
    // 验证用户是否存在
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('用户不存在');
    }

    // 获取权限记录
    const permission = await Permission.findOne({ userId });
    if (!permission) {
      return {
        user,
        menuCodes: [],
        isAdmin: user.isAdmin
      };
    }

    return {
      user,
      menuCodes: permission.menuCodes,
      isAdmin: user.isAdmin
    };
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
