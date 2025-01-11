const Joi = require('joi');

/**
 * 从对象中提取指定的字段
 * @param {Object} object - 源对象
 * @param {Array} keys - 需要提取的字段数组
 * @returns {Object} - 包含指定字段的新对象
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

/**
 * 请求数据验证中间件
 * @param {Object} schema - Joi验证模式
 * @returns {Function} Express中间件函数
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    
    return res.status(400).json({
      code: 'A00400',
      statusCode: 400,
      msg: errorMessage,
      data: null,
      timestamp: new Date().toISOString()
    });
  }

  // 将验证后的值合并到请求对象中
  Object.assign(req, value);
  return next();
};

module.exports = {
  validate
};
