const UserDAL = require('../dal/user.dal');
const { generateToken } = require('../utils/jwt');

class UserService {
  static async register(userData) {
    // const existingUser = await UserDAL.findByEmail(userData.email);
    // if (existingUser) {
    //   throw new Error('Email already registered');
    // }
    
    const user = await UserDAL.create(userData);
    const token = generateToken(user._id);
    
    return { user, token };
  }

  static async login(email, password) {
    const user = await UserDAL.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = generateToken(user._id);
    return { user, token };
  }

  static async deleteUser(userId, hardDelete = false) {
    if (hardDelete) {
      return UserDAL.hardDelete(userId);
    }
    return UserDAL.softDelete(userId);
  }

  static async getUserById(userId) {
    const user = await UserDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = UserService;
