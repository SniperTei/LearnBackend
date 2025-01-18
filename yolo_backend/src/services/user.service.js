const UserDAL = require('../dal/user.dal');
const { generateToken } = require('../utils/jwt');

class UserService {
  constructor() {
    this.userDAL = new UserDAL();
  }

  async register(userData) {
    // const existingUser = await this.userDAL.findByEmail(userData.email);
    // if (existingUser) {
    //   throw new Error('Email already registered');
    // }
    
    const user = await this.userDAL.create(userData);
    const token = generateToken(user._id);
    
    return { 
      user: this._formatUser(user), 
      token 
    };
  }

  async login(email, password) {
    const user = await this.userDAL.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = generateToken(user._id);
    return { 
      user: this._formatUser(user), 
      token 
    };
  }

  async deleteUser(userId, hardDelete = false) {
    const deletedUser = hardDelete 
      ? await this.userDAL.hardDelete(userId)
      : await this.userDAL.softDelete(userId);
    return this._formatUser(deletedUser);
  }

  async getUserById(userId) {
    const user = await this.userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this._formatUser(user);
  }

  /**
   * 格式化用户数据，将_id转换为userId
   * @private
   */
  _formatUser(user) {
    if (!user) return null;

    const userObj = user.toObject ? user.toObject() : user;
    const { _id, password, ...rest } = userObj;

    return {
      userId: _id.toString(),
      ...rest
    };
  }
}

module.exports = UserService;
