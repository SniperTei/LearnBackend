const moment = require('moment');

/**
 * 统一API响应格式
 */
class ApiResponse {
  static success(data = null, msg = 'Success') {
    return {
      code: '000000',
      statusCode: 200,
      msg,
      data,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    };
  }

  static error(msg = 'Error', statusCode = 500) {
    const errorCodes = {
      400: 'A00400',  // Bad Request
      401: 'A00401',  // Unauthorized
      403: 'A00403',  // Forbidden
      404: 'A00404',  // Not Found
      500: 'A00500',  // Internal Server Error
      502: 'A00502',  // Bad Gateway
      503: 'A00503',  // Service Unavailable
      504: 'A00504'   // Gateway Timeout
    };

    return {
      code: errorCodes[statusCode] || 'A00500',
      statusCode,
      msg,
      data: null,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    };
  }

  static badRequest(msg = 'Bad Request') {
    return this.error(msg, 400);
  }

  static unauthorized(msg = 'Unauthorized') {
    return this.error(msg, 401);
  }

  static forbidden(msg = 'Forbidden') {
    return this.error(msg, 403);
  }

  static notFound(msg = 'Not Found') {
    return this.error(msg, 404);
  }

  static serverError(msg = 'Internal Server Error') {
    return this.error(msg, 500);
  }
}

module.exports = ApiResponse;
