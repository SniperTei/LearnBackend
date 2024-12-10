var express = require('express');
var router = express.Router();

// drinkController
const foodController = require('../controller/foodController');

// 检索列表
router.get('/food/list', foodController.foodList);
// 添加
router.post('/food/add', foodController.foodAdd);

module.exports = router;