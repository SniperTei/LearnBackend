var express = require('express');
var router = express.Router();

// alcoholTypeController
const alcoholTypeController = require('../controller/alcoholTypeController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// 检索列表
router.get('/alcohol_type/list', alcoholTypeController.alcoholTypeList);
// 添加
router.post('/alcohol_type/add', alcoholTypeController.alcoholTypeAdd);

module.exports = router;