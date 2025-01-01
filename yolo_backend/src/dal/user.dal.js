const User = require('../models/user.model');

class UserDAL {
  static async create(userData) {
    return User.create(userData);
  }

  static async findByEmail(email) {
    return User.findOne({ email, isDeleted: false });
  }

  static async findById(id) {
    return User.findOne({ _id: id, isDeleted: false });
  }

  static async softDelete(id) {
    return User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  static async hardDelete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = UserDAL;
