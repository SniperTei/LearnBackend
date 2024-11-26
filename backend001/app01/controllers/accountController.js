// Import any required modules or dependencies here
// import db
const { generateToken } = require('../authorization');
const userProfileService = require('../service/userProfileService');

// login
const loginAPI = (req, res) => {
  // 登录
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

  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Failed to connect to the database:', err);
  //     return;
  //   }
  //   console.log('Connected to the database');
  //   // Logic to get the user of the specified username
  //   let sql = 'SELECT username, password FROM tbl_myusers tm WHERE username = ?';
  //   // Logic to get all users
  //   connection.query(sql, [req.body.username], (error, results, fields) => {
  //     if (error) {
  //       throw error;
  //     }
  //     if (results.length > 0) {
  //       console.log('results:', results);
  //       if (results[0].password === req.body.password) {
  //         let token = generateToken({ username: req.body.username });
  //         res.json({ code: '000000', msg: 'success', data: { token: token, username: req.body.username}});
  //       } else {
  //         res.json({ code: '100001', msg: '密码错误'});
  //       }
  //     } else {
  //       res.json({ code: '100002', msg: '用户不存在'});
  //     }
  //   });
  //   // Release the connection
  //   connection.release();
  // });
};

// register
// const registerAPI = (req, res) => {
//   // 注册
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Failed to connect to the database:', err);
//       return;
//     }
//     console.log('Connected to the database');
//     console.log('req.body:', req.body);
//     // Logic to insert a user
//     let sql = 'INSERT INTO tbl_myusers (username, password, nickname, email, mobile, gender, menu_permissions) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     // Logic to insert the user
//     connection.query(sql,
//       [
//         req.body.username,
//         req.body.password, 
//         req.body.nickname, 
//         req.body.email, 
//         req.body.mobile, 
//         req.body.gender,
//         req.body.menu_permissions
//       ], (error, results, fields) => {
//       if (error) {
//         throw error;
//       }
//       console.log('insert results:', results);
//       res.json({ code: '000000', msg: 'success', data: { username: req.body.username}});
//     });
//     // Release the connection
//     connection.release();
//   });
// }

// Export your controller functions
module.exports = {
  loginAPI,
  // registerAPI
};