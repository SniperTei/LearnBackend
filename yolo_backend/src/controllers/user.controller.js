const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Permission = require('../models/permission.model');
const Menu = require('../models/menu.model');
const ApiResponse = require('../utils/response');

class UserController {
  // 注册新用户
  static async register(req, res) {
    try {
      const { username, password, gender, birthDate, avatarUrl, email, mobile } = req.body;

      // 检查用户是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json(ApiResponse.error('Username already exists'));
      }

      // 创建新用户
      const user = new User({
        username,
        password,
        gender,
        birthDate,
        email,
        mobile,
        ...(avatarUrl && { avatarUrl })
      });

      await user.save();

      // 获取所有菜单codes
      const allMenus = await Menu.find({}, 'code');
      const allMenuCodes = allMenus.map(menu => menu.code);

      // 创建默认权限（包含所有菜单权限）
      const permission = new Permission({
        username: user.username,
        menuCodes: allMenuCodes,
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM'
      });
      await permission.save();

      return res.json(ApiResponse.success({
        username: user.username,
        email: user.email
      }, 'User registered successfully'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  // 用户登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 检查用户名和密码是否为空
      if (!username || !password) {
        return res.status(400).json(ApiResponse.badRequest('Username and password are required'));
      }

      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json(ApiResponse.unauthorized('Invalid username or password'));
      }

      // 直接比较客户端传来的 md5 加密密码
      const isMatch = user.password === password;
      if (!isMatch) {
        return res.status(401).json(ApiResponse.unauthorized('Invalid username or password'));
      }

      // 更新最后登录时间
      await user.updateLastLogin();

      // 生成 JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // 获取用户菜单权限并按 sort 排序
      let menus = [];
      if (user.isAdmin) {
        // 管理员获取所有菜单
        menus = await Menu.find({ isDeleted: false }).sort({ sort: 1 });
      } else {
        // 普通用户获取授权菜单
        const permission = await Permission.findOne({ username: user.username });
        if (permission) {
          menus = await Menu.find({
            code: { $in: permission.menuCodes },
            isDeleted: false
          }).sort({ sort: 1 });
        }
      }

      // 确保返回的菜单按照 sort 字段排序
      menus = menus.sort((a, b) => a.sort - b.sort);

      return res.json(ApiResponse.success({
        token,
        user: {
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          lastLoginAt: user.lastLoginAt
        },
        menus: buildMenuTree(menus)
      }, 'Login successful'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  // 获取用户资料
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json(ApiResponse.notFound('User not found'));
      }

      return res.json(ApiResponse.success({
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        mobile: user.mobile,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt
      }));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  // 更新用户资料
  static async updateProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json(ApiResponse.notFound('User not found'));
      }

      // 更新允许的字段
      const allowedUpdates = ['email', 'gender', 'birthDate', 'mobile', 'avatarUrl'];
      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          user[update] = req.body[update];
        }
      });

      await user.save();
      return res.json(ApiResponse.success({
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        mobile: user.mobile,
        avatarUrl: user.avatarUrl
      }, 'Profile updated successfully'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  // 软删除用户
  static async softDeleteUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json(ApiResponse.notFound('User not found'));
      }

      await user.softDelete();
      return res.json(ApiResponse.success(null, 'User soft deleted successfully'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  // 硬删除用户
  static async hardDeleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user.userId);
      if (!user) {
        return res.status(404).json(ApiResponse.notFound('User not found'));
      }

      return res.json(ApiResponse.success(null, 'User permanently deleted'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
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
