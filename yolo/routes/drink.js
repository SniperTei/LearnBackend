var express = require('express');
var router = express.Router();

// drinkController
const drinkController = require('../controller/drinkController');

// 检索列表
router.get('/drink/list', drinkController.drinkList);
// 添加
router.post('/drink/add', drinkController.drinkAdd);

module.exports = router;