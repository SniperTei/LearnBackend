const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/restaurant.controller');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// Create a new instance of the controller
const restaurantController = new RestaurantController();

// 餐厅相关路由
router.post('/create', restaurantController.createRestaurant.bind(restaurantController));
router.get('/list', restaurantController.getAllRestaurants.bind(restaurantController));
router.get('/query/:id', restaurantController.getRestaurantById.bind(restaurantController));
router.put('/update/:id', restaurantController.updateRestaurant.bind(restaurantController));
router.delete('/delete/:id', restaurantController.deleteRestaurant.bind(restaurantController));

module.exports = router;
