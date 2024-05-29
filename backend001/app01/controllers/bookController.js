var pool = require('../config/db');
const { generateToken, verifyToken } = require('../authorization');

const bookListAPI = (req, res) => {
  getBookList(req, res);
  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Failed to connect to the database:', err);
  //     return;
  //   }
  //   console.log('Connected to the database');
  //   // Logic to get all books
  //   let sql = 'SELECT * FROM tbl_books';
  //   connection.query(sql, (error, results, fields) => {
  //     if (error) {
  //       throw error;
  //     }
  //     console.log('results:', results);
  //     res.json(results);
  //   });
  //   // Release the connection
  //   connection.release();
  // });
};

const getBookList = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    console.log('Connected to the database');
    // Logic to get all books
    let sql = 'SELECT * FROM tbl_books';
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