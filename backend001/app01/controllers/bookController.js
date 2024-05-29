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

const bookDetailAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    getTheBook(req, res);
  });
}





// 获取书籍列表
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
    // let sql = `SELECT count(*) FROM tbl_books `;
    console.log('sql:', sql);
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log('results:', results);
      connection.execute(`SELECT count(*) FROM tbl_books`, (error, results2, fields) => {
        if (error) {
          throw error;
        }
        console.log('results count:', results2);
        let count = results2[0]['count(*)'];
        return res.json({ code: '000000', msg: 'success', data: { 
          list: results,
          total: count,
          page: page,
          limit: limit
        }});
      });
      // res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
      // res.json({ code: '000000', msg: 'success'});
    });
    // Release the connection
    connection.release();
  });
}

const getTheBook = (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    // console.log('Connected to the database');
    // console.log('req.body:', req.body);
    // console.log('req.query:', req.query);
    console.log('req.params:', req.params);
    // Logic to get a book by ID
    let sql = `SELECT * FROM tbl_books WHERE bookId = '${req.params.bookId}'`;
    console.log('sql:', sql);
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
      if (results.length === 0) {
        return res.json({ code: '100001', msg: 'book not found'});
      }
      return res.json({ code: '000000', msg: 'success', data: results[0]});
    });
    // Release the connection
    connection.release();
  });
}

// Export your controller functions
module.exports = {
  bookListAPI,
  bookDetailAPI
};