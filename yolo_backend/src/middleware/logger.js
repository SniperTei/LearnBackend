const moment = require('moment');

const requestLogger = (req, res, next) => {
    // 记录请求开始时间
    req.requestTime = moment();
    const startTime = Date.now();

    // 在响应结束时记录请求信息
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logInfo = {
            timestamp: req.requestTime.format(),
            method: req.method,
            url: req.originalUrl || req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            query: Object.keys(req.query).length ? req.query : undefined,
            body: Object.keys(req.body).length ? sanitizeBody(req.body) : undefined
        };

        // 根据状态码选择日志级别
        if (res.statusCode >= 500) {
            console.error('\nServer Error:', JSON.stringify(logInfo, null, 2));
        } else if (res.statusCode >= 400) {
            console.warn('\nClient Error:', JSON.stringify(logInfo, null, 2));
        } else {
            console.log('\nRequest Info:', JSON.stringify(logInfo, null, 2));
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
