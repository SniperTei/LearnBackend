const { generateToken } = require('../authorization');
const User = require('../model/user_profile');
// userService
const userService = {
  // 注册
  register: async (userData) => {
    try {
      const { username, password } = userData;
  
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('User already exists');
      }
  
      // Hash the password
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username,
        password,
      });
  
      // Save user to database
      await newUser.save();
  
      return { msg: 'User registered successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 登录
  login: async (userData) => {
    try {
      const { username, password } = userData;
  
      // Find user by username
      const user = await User.findOne({ username, password });
      console.log('user:', user);
      if (!user) {
        throw new Error('Invalid username or password');
      }
  
      // Compare password
      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   throw new Error('Invalid username or password');
      // }
  
      // Generate token
      const token = generateToken({ username });
      // 打印token
      console.log('token:', token);
  
      return { msg: 'Login successful', data: { token } };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = userService;