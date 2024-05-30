var pool = require('../config/db');
const { verifyToken } = require('../authorization');
const moment = require('moment');
const bookDAO = require('../dao/bookDAO');

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

const bookDetail2API = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    getTheBook(req, res);
  });
}

const addBookAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    addTheBook(req, res);
  });
}

const updateBookAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    updateTheBook(req, res);
  });
}



// 获取书籍列表
const getBookList = (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.query:', req.query);
  console.log('req.params:', req.params);
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let offset = (page - 1) * limit;
  bookDAO.getBookList(page, limit, req.query.book, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      return res.json({ code: '999999', msg: 'ERROR : ' + err});
    }
    // 遍历results，将pubdate转换为yyyy-MM-dd格式
    result.forEach(item => {
      item.pubdate = moment(item.pubdate).format('YYYY-MM-DD');
    });
    bookDAO.getBookCount(req.query.book, (err, count) => {
      if (err) {
        console.error('An error occurred:', err);
        return res.json({ code: '999999', msg: 'ERROR : ' + err});
      }
      return res.json({ code: '000000', msg: 'success', data: { 
        list: result,
        total: count,
        page: page,
        limit: limit
      }});
    });
  });
  // Get a connection from the pool
  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error('Failed to connect to the database:', err);
  //     return;
  //   }
  //   console.log('Connected to the database');
  //   // Logic to get all books
  //   // let sql = 'SELECT * FROM tbl_books';
  //   // let sql = `SELECT * FROM tbl_books LIMIT ${limit} OFFSET ${offset}`;
  //   let sql = `SELECT * FROM tbl_books bt where 1=1`;
  //   if (req.query.book.title) {
  //     sql += ` AND bt.title like '%${req.query.book.title}%'`;
  //   }
  //   if (req.query.book.author) {
  //     sql += ` AND bt.author like '%${req.query.book.author}%'`;
  //   }
  //   if (req.query.book.publisher) {
  //     sql += ` AND bt.publisher like '%${req.query.book.publisher}%'`;
  //   }
  //   sql += ` LIMIT ${limit} OFFSET ${offset}`;
  //   // let sql = `SELECT count(*) FROM tbl_books `;
  //   console.log('sql:', sql);
  //   connection.query(sql, (error, results, fields) => {
  //     // 遍历results，将pubdate转换为yyyy-MM-dd格式
  //     results.forEach(item => {
  //       item.pubdate = moment(item.pubdate).format('YYYY-MM-DD');
  //     });
  //     if (error) {
  //       // throw error;
  //       return res.json({ code: '999999', msg: 'ERROR : ' + error});
  //     }
  //     // console.log('results:', results);
  //     connection.execute(`SELECT count(*) FROM tbl_books`, (error, results2, fields) => {
  //       if (error) {
  //         // throw error;
  //         return res.json({ code: '999999', msg: 'ERROR : ' + error});
  //       }
  //       console.log('results count:', results2);
  //       let count = results2[0]['count(*)'];
  //       return res.json({ code: '000000', msg: 'success', data: { 
  //         list: results,
  //         total: count,
  //         page: page,
  //         limit: limit
  //       }});
  //     });
  //     // res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
  //     // res.json({ code: '000000', msg: 'success'});
  //   });
  //   // Release the connection
  //   connection.release();
  // });
}
// 获取书籍详情
const getTheBook = (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    // console.log('Connected to the database');
    console.log('req.body:', req.body);
    console.log('req.query:', req.query);
    console.log('req.params:', req.params);
    // Logic to get a book by ID
    let sql = `SELECT * FROM tbl_books tb WHERE tb.bookId = '${req.params.bookId}'`;
    // if (req.params.book.bookId) {
    //   sql += ` AND tb.bookId = '${req.params.bookId}'`;
    // }
    // if (req.query.title) {
    //   sql += ` AND tb.title = '${req.query.title}'`;
    // }
    // if (req.query.author) {
    //   sql += ` AND tb.author = '${req.query.author}'`;
    // }
    // if (req.query.publisher) {
    //   sql += ` AND tb.publisher = '${req.query.publisher}'`;
    // }
    console.log('sql:', sql);
    connection.query(sql, (error, results, fields) => {
      if (error) {
        // throw error;
        return res.json({ code: '999999', msg: 'ERROR : ' + error});
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

// 添加书籍
const addTheBook = (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    let userInfo = req.decoded; // { username: 'sniper', iat: 1716979789, exp: 1716983389 }
    req.body.updated_by = userInfo.username;
    req.body.created_by = userInfo.username;
    req.body.created_at = new Date();
    req.body.updated_at = new Date();
    console.log('req.params:', req.params);
    // Logic to get a book by ID
    // let sql = `INSERT INTO tbl_books (bookId, title, author, price, publisher, pubdate, type, created_by, updated_by, created_at, updated_at) VALUES (
    //   '${req.body.bookId}',
    //   '${req.body.title}',
    //   '${req.body.author}',
    //   '${req.body.price}',
    //   '${req.body.publisher}',
    //   '${req.body.pubdate}',
    //   '${req.body.type}',
    //   '${req.body.created_by}',
    //   '${req.body.updated_by}',
    //   '${created_at}', 
    //   '${updated_at}'
    // )`;
    let sql = `INSERT INTO tbl_books SET ?`;
    console.log('sql:', sql);
    connection.query(sql, req.body, (error, results, fields) => {
    // connection.query(sql, (error, results, fields) => {
      if (error) {
        // throw error;
        return res.json({ code: '100002', msg: 'add book failed' + error});
      }
      return res.json({ code: '000000', msg: 'success', data: results[0]});
    });
    // Release the connection
    connection.release();
  });
}

// 修改书籍
const updateTheBook = (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    console.log('req.body:', req.body);
    let userInfo = req.decoded; // { username: 'sniper', iat: 1716979789, exp: 1716983389 }
    req.body.updated_by = userInfo.username;
    // console.log('req.query:', req.query);
    // console.log('req.params:', req.params);
    // 从token中获取用户信息
    // console.log('req.user:', req.user);
    // Logic to get a book by ID
    // let sql = `UPDATE tbl_books SET title = '${req.body.title}', author = '${req.body.author}', price = '${req.body.price}', publisher = '${req.body.publisher}', pubdate = '${req.body.pubdate}', type = '${req.body.type}' WHERE bookId = '${req.params.bookId}'`;
    let sql = `UPDATE tbl_books SET ? WHERE bookId = '${req.params.bookId}'`;
    console.log('sql:', sql);
    connection.query(sql, req.body, (error, results, fields) => {
      if (error) {
        // throw error;
        return res.json({ code: '100003', msg: 'update book failed' + error});
      }
      return res.json({ code: '000000', msg: 'success', data: results[0]});
    });
    // connection.query(sql, (error, results, fields) => {
    //   if (error) {
    //     // throw error;
    //     return res.json({ code: '100003', msg: 'update book failed' + error});
    //   }
    //   return res.json({ code: '000000', msg: 'success', data: results[0]});
    // });
    // Release the connection
    connection.release();
  });
}

// Export your controller functions
module.exports = {
  bookListAPI,
  bookDetailAPI,
  // bookDetail2API,
  addBookAPI,
  updateBookAPI
};