var pool = require('../config/db');
const { verifyToken } = require('../authorization');

const bookListAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    getBookList(req, res);
  });
};

const getBookList = (req, res) => {
  let page = req.body.page || 1;
  let limit = req.body.limit || 10;
  let offset = (page - 1) * limit;
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    console.log('Connected to the database');
    // Logic to get all books
    // let sql = 'SELECT * FROM tbl_books';
    let sql = `SELECT * FROM tbl_books LIMIT ${limit} OFFSET ${offset}`;
    console.log('sql:', sql);
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log('results:', results);
      res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
    });
    // Release the connection
    connection.release();
  });
}

// Export your controller functions
module.exports = {
  bookListAPI
};