var express = require('express');
var router = express.Router();
// userController
const movieController = require('../controller/movieController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 检索列表
router.get('/movie/list', movieController.movieList);
// 添加
router.post('/movie/add', movieController.movieAdd);

module.exports = router;
