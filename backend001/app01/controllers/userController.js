// Import any required modules or dependencies here
// import db
var pool = require('../config/db');

// Define your controller functions
const userList = (req, res) => {
  // Your code to fetch all movies from the database or any other data source
  // For now, let's just send a dummy response
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    console.log('Connected to the database');
    let sql = 'SELECT username, nickname, email, mobile, gender FROM tbl_myusers tm';
    // Logic to get all users
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
      res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
    });
    // Release the connection
    connection.release();
  });
  // res.json({ message: 'Get all users' });
};
const getUser = (req, res) => {
  // Logic to get a user
  res.json({ message: 'Get a user' });
};

const createUser = (req, res) => {
  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Failed to connect to the database:', err);
  //     return;
  //   }
  //   console.log('Connected to the database');
  //   // Logic to create a user
  //   connection.query('INSERT INTO users SET ?', req.body, (error, results, fields) => {
  //     if (error) throw error;
  //     res.json({ message: 'Create a user' });
  //   });
  //   // Release the connection
  //   connection.release();
  // }
  // Logic to create a user
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
  // 如果用户名和密码都是sniper，返回登录成功
  if (req.body.username === 'sniper' && req.body.password === 'sniper') {
    res.json({ message: 'Login success' });
  } else {
    res.json({ message: 'Login failed' });
  }
  // Logic to login
  // res.json({ message: 'Login' });
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