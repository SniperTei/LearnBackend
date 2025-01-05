const express = require('express');
const router = express.Router();
const foodMenuController = require('../controllers/foodmenu.controller');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 菜品相关路由
router.post('/create', foodMenuController.createFoodMenu);
router.get('/list', foodMenuController.getAllFoodMenus);
router.get('/query/:id', foodMenuController.getFoodMenuById);
router.put('/update/:id', foodMenuController.updateFoodMenu);
router.delete('/delete/:id', foodMenuController.deleteFoodMenu);

module.exports = router;
