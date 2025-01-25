const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const UserService = require('../services/user.service');
const Menu = require('../models/menu.model');
const Response = require('../utils/response');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * 用户注册
   */
  async register(req, res) {
    try {
      const { username, password, gender, birthDate, avatarUrl, email, mobile } = req.body;

      // 检查用户是否已存在
      const existingUser = await this.userService.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json(Response.error('Username already exists'));
      }

      // 创建新用户
      const { user, token } = await this.userService.register({
        username,
        password,
        gender,
        birthDate,
        email,
        mobile,
        ...(avatarUrl && { avatarUrl })
      });

      return res.json(Response.success({
        token,
        user
      }, 'User registered successfully'));
    } catch (error) {
      return res.status(400).json(Response.error(error.message));
    }
  }

  /**
   * 用户登录
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json(Response.badRequest('Username and password are required'));
      }

      try {
        const { user, permissions, token } = await this.userService.login(username, password);

        // 获取用户菜单权限并按 sort 排序
        let menus = [];
        if (user.isAdmin) {
          // 管理员获取所有菜单
          menus = await Menu.find({ isDeleted: false }).sort({ sort: 1 });
        } else {
          // 普通用户获取授权菜单
          menus = await Menu.find({
            code: { $in: permissions.menuCodes },
            isDeleted: false
          }).sort({ sort: 1 });
        }

        return res.json(Response.success({
          token,
          user: {
            ...user,
            permissions: permissions.menuCodes
          },
          menus: buildMenuTree(menus)
        }, 'Login successful'));
      } catch (error) {
        if (error.message === 'Invalid login credentials') {
          return res.status(401).json(Response.unauthorized('Invalid username or password'));
        }
        throw error;
      }
    } catch (error) {
      return res.status(500).json(Response.error(error.message));
    }
  }

  /**
   * 获取用户资料
   */
  async getProfile(req, res) {
    try {
      const user = await this.userService.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json(Response.notFound('User not found'));
      }
      
      return res.json(Response.success({
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        mobile: user.mobile,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt
      }));
    } catch (error) {
      return res.status(500).json(Response.error(error.message));
    }
  }

  /**
   * 软删除用户
   */
  async softDeleteUser(req, res) {
    try {
      const user = await this.userService.deleteUser(req.user.userId, false);
      if (!user) {
        return res.status(404).json(Response.notFound('User not found'));
      }
      
      return res.json(Response.success(null, 'User soft deleted successfully'));
    } catch (error) {
      return res.status(500).json(Response.error(error.message));
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(req, res) {
    try {
      const user = await this.userService.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json(Response.notFound('User not found'));
      }

      // 更新允许的字段
      const allowedUpdates = ['email', 'gender', 'birthDate', 'mobile', 'avatarUrl'];
      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          user[update] = req.body[update];
        }
      });

      await user.save();
      return res.json(Response.success({
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        mobile: user.mobile,
        avatarUrl: user.avatarUrl
      }, 'Profile updated successfully'));
    } catch (error) {
      return res.status(400).json(Response.error(error.message));
    }
  }

  /**
   * 硬删除用户
   */
  async hardDeleteUser(req, res) {
    try {
      const user = await this.userService.deleteUser(req.user.userId, true);
      if (!user) {
        return res.status(404).json(Response.notFound('User not found'));
      }

      return res.json(Response.success(null, 'User permanently deleted'));
    } catch (error) {
      return res.status(500).json(Response.error(error.message));
    }
  }

  /**
   * 获取用户列表（管理员接口）
   */
  async listUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, username, email, isAdmin } = req.query;
      const filters = {};

      // 构建过滤条件
      if (username) filters.username = new RegExp(username, 'i');
      if (email) filters.email = new RegExp(email, 'i');
      if (isAdmin !== undefined) filters.isAdmin = isAdmin === 'true';

      const result = await this.userService.listUsers(filters, { page, limit });
      console.log('User controller result:', result);
      res.json(Response.success(result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户菜单权限（管理员接口）
   */
  async updateUserMenus(req, res, next) {
    try {
      const { userId } = req.params;
      const { menuCodes, isAdmin } = req.body;

      const result = await this.userService.updateUserMenus(userId, { menuCodes, isAdmin });
      res.json(Response.success(result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户菜单权限（管理员接口）
   */
  async getUserMenus(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await this.userService.getUserMenus(userId);
      res.json(Response.success(result));
    } catch (error) {
      next(error);
    }
  }
}

// 构建菜单树
function buildMenuTree(menus) {
  const menuMap = {};
  const menuTree = [];

  // 首先将所有菜单放入map中
  menus.forEach(menu => {
    menuMap[menu.code] = {
      ...menu.toObject(),
      children: []
    };
  });

  // 构建树形结构
  menus.forEach(menu => {
    const menuNode = menuMap[menu.code];
    const codeSegments = menu.code.split('_');
    
    if (codeSegments.length === 1) {
      // 顶级菜单
      menuTree.push(menuNode);
    } else {
      // 子菜单，找到父菜单并添加到其children中
      const parentCode = codeSegments.slice(0, -1).join('_');
      const parentNode = menuMap[parentCode];
      if (parentNode) {
        parentNode.children.push(menuNode);
      }
    }
  });

  return menuTree;
}

module.exports = UserController;
