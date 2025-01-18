const express = require('express');
const router = express.Router();
const FoodMenuController = require('../controllers/foodmenu.controller');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// Create a new instance of the controller
const foodMenuController = new FoodMenuController();

// 菜品相关路由
router.post('/create', foodMenuController.createFoodMenu.bind(foodMenuController));
router.get('/list', foodMenuController.getAllFoodMenus.bind(foodMenuController));
router.get('/query/:id', foodMenuController.getFoodMenuById.bind(foodMenuController));
router.put('/update/:id', foodMenuController.updateFoodMenu.bind(foodMenuController));
router.delete('/delete/:id', foodMenuController.deleteFoodMenu.bind(foodMenuController));

// 随机推荐菜品
router.get('/random', foodMenuController.getRandomFoodMenus.bind(foodMenuController));

module.exports = router;
