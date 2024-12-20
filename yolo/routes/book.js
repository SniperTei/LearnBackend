var express = require('express');
var router = express.Router();
// userController
const movieController = require('../controller/bookController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 检索列表
router.get('/book/list', movieController.bookList);
// 添加
router.post('/book/add', movieController.bookAdd);

module.exports = router;
