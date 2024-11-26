const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
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
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  menu_permissions: {
    type: [String],
    required: true,
  },
});
const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
module.exports = UserProfile;