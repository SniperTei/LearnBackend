const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const auth = require('../middleware/auth');

// Create a new instance of the controller
const customerController = new CustomerController();

// 获取酒类列表，支持分页和过滤
router.get('/list', customerController.getAllCustomers.bind(customerController));

// 所有酒类相关的路由都需要认证
router.use(auth);

// 创建酒类
router.post('/create', customerController.createCustomer.bind(customerController));

// 获取单个酒类详情
router.get('/query/:id', customerController.getCustomerById.bind(customerController));

// 更新酒类
router.put('/update/:id', customerController.updateCustomer.bind(customerController));

// 删除酒类
router.delete('/delete/:id', customerController.deleteCustomer.bind(customerController));

module.exports = router;
