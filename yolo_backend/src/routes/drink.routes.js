const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drink.controller');
const auth = require('../middleware/auth');

// 创建饮品（需要认证）
router.post('/create', auth, drinkController.createDrink);

// 获取当前用户的所有饮品（需要认证）
router.get('/list', auth, drinkController.getAllDrinks);

// 获取单个饮品
router.get('/:id', drinkController.getDrinkById);

// 更新饮品
router.put('/:id', drinkController.updateDrink);

// 删除饮品
router.delete('/:id', drinkController.deleteDrink);

module.exports = router;
