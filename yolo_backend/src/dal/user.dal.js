const User = require('../models/user.model');

class UserDAL {
  /**
   * 创建新用户
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * 根据用户名查找用户
   * 不使用 lean() 以保留 Mongoose 方法
   */
  async findByUsername(username) {
    return await User.findOne({ username, isDeleted: false });
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email) {
    return await User.findOne({ email, isDeleted: false });
  }

  /**
   * 根据ID查找用户
   */
  async findById(id) {
    return await User.findOne({ _id: id, isDeleted: false });
  }

  /**
   * 更新用户信息
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * 软删除用户
   */
  async softDelete(id) {
    return await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).lean();
  }

  /**
   * 硬删除用户
   */
  async hardDelete(id) {
    return await User.findByIdAndDelete(id).lean();
  }
}

module.exports = UserDAL;
