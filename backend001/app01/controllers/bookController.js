var pool = require('../config/db');
const { verifyToken } = require('../authorization');
const moment = require('moment');
const bookDAO = require('../dao/bookDAO');
const bookService = require('../service/bookService');

// 获取书籍列表
const bookListAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    bookService.queryBooks(req.query).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
};
// 获取书籍详情
const bookDetailAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    bookService.queryBookById(req.params.bookId).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}
// 添加书籍
const addBookAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    bookService.addBook(req.body).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }
    ).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}
// 更新书籍
const updateBookAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    bookService.updateBook(req.body).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

// 删除书籍
const deleteBookAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    bookService.deleteBook(req.body).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

// Export your controller functions
module.exports = {
  bookListAPI,
  bookDetailAPI,
  addBookAPI,
  updateBookAPI
};