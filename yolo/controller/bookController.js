const { verifyToken } = require('../authorization');
const bookService = require('../service/bookService');

const bookList = async (req, res) => {
  bookService.queryBookList(req.query).then(result => {
    res.json({
      code: '000000',
      msg: result.msg,
      data: result.data
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
}

const bookAdd = async (req, res) => {
  const token = req.headers['authorization'];
  try {
    let verifyResult = verifyToken(token);
    if (!verifyResult.valid) {
      throw new Error('Invalid token');
    }
    console.log('req.body:', req.body);
    let tokenInfo = verifyResult.decoded;
    // decode token { username: 'teinan', iat: 1734156707, exp: 1734160307 }
    // 默认给加的这俩字段
    req.body.created_by = tokenInfo.username;
    req.body.updated_by = tokenInfo.username;
    bookService.addBook(req.body).then(result => {
      res.json({
        code: '000000',
        msg: result.msg,
      });
    }).catch(err => {
      res.json({
        code: '100001',
        msg: err.message,
      });
    });
  } catch (error) {
    res.json({
      code: '100002',
      msg: 'Invalid token',
    });
  }
}

const bookUpdate = async (req, res) => {
  const token = req.headers['authorization'];
  try {
    let verifyResult = verifyToken(token);
    if (!verifyResult.valid) {
      throw new Error('Invalid token');
    }
    let tokenInfo = verifyResult.decoded;
    // decode token { username: 'teinan', iat: 1734156707, exp: 1734160307 }
    req.body.updated_by = tokenInfo.username;
    bookService.updateBook(req.body).then(result => {
      res.json({
        code: '000000',
        msg: result.msg,
      });
    }).catch(err => {
      res.json({
        code: '100001',
        msg: err.message,
      });
    });
  } catch (error) {
    res.json({
      code: '100002',
      msg: 'Invalid token',
    });
  }
}
// 物理删除
const bookPhysicalDelete = async (req, res) => {
  const token = req.headers['authorization'];
  try {
    let verifyResult = verifyToken(token);
    if (!verifyResult.valid) {
      throw new Error('Invalid token');
    }
    console.log('req.params:', req.params);
    bookService.deleteBook(req.params).then(result => {
      res.json({
        code: '000000',
        msg: result.msg,
      });
    }).catch(err => {
      res.json({
        code: '100001',
        msg: err.message,
      });
    });
  } catch (error) {
    res.json({
      code: '100002',
      msg: 'Invalid token',
    });
  }
}

// 逻辑删除
// const bookLogicalDelete = async (req, res) => {
//   const token = req.headers['authorization'];
//   try {
//     let verifyResult = verifyToken(token);
//     if (!verifyResult.valid) {
//       throw new Error('Invalid token');
//     }
//     bookService.deleteBook(req.body).then(result => {
//       res.json({
//         code: '000000',
//         msg: result.msg,
//       });
//     }).catch(err => {
//       res.json({
//         code: '100001',
//         msg: err.message,
//       });
//     });
//   } catch (error) {
//     res.json({
//       code: '100002',
//       msg: 'Invalid token',
//     });
//   }
// }

// 查详情
const bookDetail = async (req, res) => {
  bookService.queryBookDetail(req.params).then(result => {
    res.json({
      code: '000000',
      msg: result.msg,
      data: result.data
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
}

module.exports = {
  bookList,
  bookAdd,
  bookUpdate,
  bookPhysicalDelete,
  bookDetail
};