const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Create a new instance of the controller
const customerController = new CustomerController();

// 添加认证中间件
router.use(authMiddleware);

// 获取客户列表，支持分页和过滤
router.get('/', customerController.getAllCustomers.bind(customerController));

// 创建客户
router.post('/', customerController.createCustomer.bind(customerController));

// 获取单个客户详情
router.get('/:id', customerController.getCustomerById.bind(customerController));

// 更新客户
router.put('/:id', customerController.updateCustomer.bind(customerController));

// 删除客户
router.delete('/:id', customerController.deleteCustomer.bind(customerController));

module.exports = router;
