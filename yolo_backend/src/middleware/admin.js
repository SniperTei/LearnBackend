const { ErrorCode } = require('../utils/error');

const adminCheck = (req, res, next) => {
  try {
    // 从认证中间件获取用户信息
    const user = req.user;
    
    // 检查用户是否是管理员
    if (!user.isAdmin) {
      return res.status(403).json({
        code: ErrorCode.FORBIDDEN,
        statusCode: 403,
        msg: '只有管理员才能执行此操作',
        data: null,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminCheck;
