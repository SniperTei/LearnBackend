var express = require('express');
var router = express.Router();

// userController
const alcoholController = require('../controller/alcoholController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// 检索列表
router.get('/alcohol/list', alcoholController.alcoholList);
// 添加
router.post('/alcohol/add', alcoholController.alcoholAdd);

module.exports = router;