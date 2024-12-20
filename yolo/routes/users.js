var express = require('express');
var router = express.Router();
// userController
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 登录
router.post('/user/login', userController.login);
// 注册
router.post('/user/register', userController.register);

module.exports = router;
