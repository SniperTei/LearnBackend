const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/performance.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 添加认证中间件
router.use(authMiddleware);

router.post('/', PerformanceController.createPerformance);
router.get('/', PerformanceController.getAllPerformances);
router.get('/:id', PerformanceController.getPerformanceById);
router.put('/:id', PerformanceController.updatePerformance);
router.delete('/:id', PerformanceController.deletePerformance);
router.post('/with-customer', PerformanceController.createCustomerWithPerformance);

module.exports = router; 