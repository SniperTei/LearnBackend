const express = require('express');
const router = express.Router();
const DrinkController = require('../controllers/drink.controller');
const auth = require('../middleware/auth');

// 所有饮品相关的路由都需要认证
router.use(auth);

// Create a new instance of the controller
const drinkController = new DrinkController();

// 创建饮品记录
router.post('/create', drinkController.createDrink.bind(drinkController));

// 获取当前用户的所有饮品记录，支持分页和过滤
router.get('/list', drinkController.getAllDrinks.bind(drinkController));

// 获取单个饮品记录详情
router.get('/query/:id', drinkController.getDrinkById.bind(drinkController));

// 更新饮品记录
router.put('/update/:id', drinkController.updateDrink.bind(drinkController));

// 删除饮品记录
router.delete('/delete/:id', drinkController.deleteDrink.bind(drinkController));

module.exports = router;
