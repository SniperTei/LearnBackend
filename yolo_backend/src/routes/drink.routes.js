const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drink.controller');

// 创建饮品
router.post('/create', drinkController.createDrink);

// 获取所有饮品
router.get('/list', drinkController.getAllDrinks);

// 获取单个饮品
router.get('/:id', drinkController.getDrinkById);

// 更新饮品
router.put('/:id', drinkController.updateDrink);

// 删除饮品
router.delete('/:id', drinkController.deleteDrink);

module.exports = router;
