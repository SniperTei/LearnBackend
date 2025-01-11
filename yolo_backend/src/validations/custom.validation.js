const mongoose = require('mongoose');

/**
 * 验证MongoDB ObjectId
 * @param {string} value - 要验证的值
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

/**
 * 验证密码强度
 * @param {string} value - 要验证的密码
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

/**
 * 验证URL格式
 * @param {string} value - 要验证的URL
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const url = (value, helpers) => {
  try {
    new URL(value);
    return value;
  } catch (error) {
    return helpers.message('"{{#label}}" must be a valid URL');
  }
};

/**
 * 验证日期格式
 * @param {string} value - 要验证的日期字符串
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const date = (value, helpers) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return helpers.message('"{{#label}}" must be a valid date');
  }
  return value;
};

/**
 * 验证手机号格式（中国大陆）
 * @param {string} value - 要验证的手机号
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const phone = (value, helpers) => {
  if (!value.match(/^1[3-9]\d{9}$/)) {
    return helpers.message('"{{#label}}" must be a valid phone number');
  }
  return value;
};

/**
 * 验证邮箱格式
 * @param {string} value - 要验证的邮箱
 * @param {Object} helpers - Joi helpers对象
 * @returns {string|Object} - 验证通过返回值，失败返回错误对象
 */
const email = (value, helpers) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return helpers.message('"{{#label}}" must be a valid email');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  url,
  date,
  phone,
  email
};
