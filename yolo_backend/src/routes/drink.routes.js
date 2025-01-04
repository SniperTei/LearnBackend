const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drink.controller');
const auth = require('../middleware/auth');

// 所有饮品相关的路由都需要认证
router.use(auth);

// 创建饮品记录
router.post('/create', drinkController.createDrink);

// 获取当前用户的所有饮品记录，支持分页和过滤
router.get('/list', drinkController.getAllDrinks);

// 获取单个饮品记录详情
router.get('/:id', drinkController.getDrinkById);

// 更新饮品记录
router.put('/:id', drinkController.updateDrink);

// 删除饮品记录
router.delete('/:id', drinkController.deleteDrink);

module.exports = router;
