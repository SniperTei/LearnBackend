const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiResponse = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json(ApiResponse.unauthorized('No authentication token'));
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json(ApiResponse.unauthorized({
        message: 'Invalid authentication token'
      }));
    }
    console.log('Token payload:', decoded);

    // 检查用户是否存在且未被删除
    const user = await User.findById(decoded.userId).select('+isDeleted');
    if (!user || user.isDeleted) {
      return res.status(401).json(ApiResponse.unauthorized('User not found or deleted'));
    }

    // 将用户信息添加到请求对象
    req.user = {
      userId: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json(ApiResponse.unauthorized('Please authenticate'));
  }
};

module.exports = auth;
