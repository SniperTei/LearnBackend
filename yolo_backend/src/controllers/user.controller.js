const User = require('../models/user.model');
const Menu = require('../models/menu.model');
const Permission = require('../models/permission.model');
const jwt = require('jsonwebtoken');

class UserController {
  static async register(req, res) {
    try {
      const { username, password, gender, birthDate, avatarUrl } = req.body;

      // 检查用户是否已存在
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // 创建新用户
      const user = new User({
        username,
        password,
        gender,
        birthDate,
        ...(avatarUrl && { avatarUrl })
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 调试日志
      // console.log('Login Request:');
      // console.log('Headers:', req.headers);
      // console.log('Body:', req.body);
      // console.log('Content-Type:', req.headers['content-type']);
      
      // 检查用户名和密码是否为空
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // 查找用户
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }
      // 打印password
      console.log('Password:', user.password);
      console.log('Password:', password);
      // 验证密码
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password2'
        });
      }

      // 更新最后登录时间
      await user.updateLastLogin();

      // 获取用户的菜单权限
      let menus = [];
      if (user.isAdmin) {
        // 管理员获取所有菜单
        menus = await Menu.find().sort({ code: 1 });
      } else {
        // 普通用户获取其权限内的菜单
        const permission = await Permission.findOne({ username: user.username });
        if (permission) {
          menus = await Menu.find({
            code: { $in: permission.menuCodes }
          }).sort({ code: 1 });
        }
      }

      // 构建菜单树
      const menuTree = buildMenuTree(menus);

      // 生成 JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          menus: menuTree
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const updates = req.body;
      const allowedUpdates = ['gender', 'birthDate', 'avatarUrl'];
      
      // 过滤不允许更新的字段
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        updates,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async softDeleteUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.softDelete();

      res.json({
        success: true,
        message: 'User soft deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async hardDeleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User permanently deleted'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// 构建菜单树的辅助函数
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
