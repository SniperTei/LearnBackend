const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        code: 'A00401',
        statusCode: 401,
        msg: '未提供认证token',
        data: null
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 将用户信息添加到请求对象
    req.user = {
      id: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    return res.status(401).json({
      code: 'A00401',
      statusCode: 401,
      msg: 'token无效或已过期',
      data: null
    });
  }
};

module.exports = authMiddleware; 