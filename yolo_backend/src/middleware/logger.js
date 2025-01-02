const moment = require('moment');

const requestLogger = (req, res, next) => {
    // 记录请求开始时间
    req.requestTime = moment();
    const startTime = Date.now();

    // 在响应结束时记录请求信息
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        // 构建基础日志信息
        const logInfo = {
            timestamp: req.requestTime.format('YYYY-MM-DD HH:mm:ss.SSS'),
            method: req.method,
            url: req.originalUrl || req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        // 添加请求参数
        if (Object.keys(req.query).length) {
            logInfo.query = req.query;
        }
        
        if (Object.keys(req.body).length) {
            logInfo.body = sanitizeBody(req.body);
        }

        // 添加用户信息（如果有）
        if (req.user) {
            logInfo.user = {
                id: req.user.userId,
                username: req.user.username
            };
        }

        // 构建日志输出
        const logMessage = `
==========================================================
  API Request | ${logInfo.timestamp}
----------------------------------------------------------
  Method: ${logInfo.method}
  URL: ${logInfo.url}
  Status: ${logInfo.status}
  Duration: ${logInfo.duration}
  IP: ${logInfo.ip}
----------------------------------------------------------
  Query: ${JSON.stringify(logInfo.query || {}, null, 2)}
  Body: ${JSON.stringify(logInfo.body || {}, null, 2)}
  User: ${logInfo.user ? JSON.stringify(logInfo.user, null, 2) : 'Not authenticated'}
==========================================================`;

        // 根据状态码选择日志级别
        if (res.statusCode >= 500) {
            console.error('\x1b[31m%s\x1b[0m', logMessage); // 红色
        } else if (res.statusCode >= 400) {
            console.warn('\x1b[33m%s\x1b[0m', logMessage);  // 黄色
        } else {
            console.log('\x1b[32m%s\x1b[0m', logMessage);   // 绿色
        }
    });

    next();
};

// 清理敏感信息
const sanitizeBody = (body) => {
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '******';
        }
    });

    return sanitized;
};

module.exports = requestLogger;
