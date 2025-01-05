const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 餐厅相关路由
router.post('/create', restaurantController.createRestaurant);
router.get('/list', restaurantController.getAllRestaurants);
router.get('/query/:id', restaurantController.getRestaurantById);
router.put('/update/:id', restaurantController.updateRestaurant);
router.delete('/delete/:id', restaurantController.deleteRestaurant);

module.exports = router;
