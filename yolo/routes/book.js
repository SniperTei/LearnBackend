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
// 修改
router.post('/book/update', movieController.bookUpdate);
// 删除
router.post('/book/delete/:_id', movieController.bookPhysicalDelete);
// 详情
router.get('/book/detail/:_id', movieController.bookDetail);

module.exports = router;
