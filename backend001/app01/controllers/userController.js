// Import any required modules or dependencies here
// import db

const { generateToken, verifyToken } = require('../authorization');
const userProfileService = require('../service/userProfileService');

// Define your controller functions
const userList = (req, res) => {
  // Your code to fetch all movies from the database or any other data source
  // For now, let's just send a dummy response
  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Failed to connect to the database:', err);
  //     return;
  //   }
  //   console.log('Connected to the database');
  //   let sql = 'SELECT username, nickname, email, mobile, gender FROM tbl_myusers tm';
  //   // Logic to get all users
  //   connection.query(sql, (error, results, fields) => {
  //     if (error) {
  //       throw error;
  //     }
  //     res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
  //   });
  //   // Release the connection
  //   connection.release();
  // });
  res.json({ message: 'Get all users' });
};
const getUser = (req, res) => {
  // Logic to get a user
  res.json({ message: 'Get a user' });
};

const createUser = (req, res) => {
  res.json({ message: 'Create a user' });
};

const updateUser = (req, res) => {
  // Logic to update a user
  res.json({ message: 'Update a user' });
};

const deleteUser = (req, res) => {
  // Logic to delete a user
  res.json({ message: 'Delete a user' });
};

// login
const login = (req, res) => {
  userProfileService.queryUserProfile(req.body.username).then((userProfile) => {
    if (userProfile) {
      console.log('userProfile:', userProfile);
      if (userProfile.password === req.body.password) {
        let token = generateToken({ username: req.body.username });
        res.json({ code: '000000', msg: 'success', data: { token: token, username: req.body.username}});
      } else {
        res.json({ code: '100001', msg: '密码错误'});
      }
    } else {
      res.json({ code: '100002', msg: '用户不存在'});
    }
  }).catch((error) => {
    console.error("An error occurred:", error);
    res.json({ code: '100003', msg: '服务器错误'});
  });
};

// Export your controller functions
module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userList,
  login
};