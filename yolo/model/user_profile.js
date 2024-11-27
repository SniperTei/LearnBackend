const mongoose = require('mongoose');

const userProfile = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  menu_permissions: {
    type: [String],
    required: false,
  },
});
// 输出模型
module.exports = mongoose.model('UserProfile', userProfile, 'user_profile');