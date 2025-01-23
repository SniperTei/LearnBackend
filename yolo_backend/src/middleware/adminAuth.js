const createError = require('http-errors');
const Response = require('../utils/response');

/**
 * 管理员权限验证中间件
 */
module.exports = async (req, res, next) => {
  try {
    // 检查用户是否已通过身份验证
    if (!req.user) {
      throw createError(401, '未授权访问');
    }

    // 检查用户是否是管理员
    if (!req.user.isAdmin) {
      throw createError(403, '需要管理员权限');
    }

    next();
  } catch (error) {
    res.status(error.status || 500).json(
      Response.error(error.message, error.status)
    );
  }
};
