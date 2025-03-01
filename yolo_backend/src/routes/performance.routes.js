const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/performance.controller');
const authMiddleware = require('../middleware/auth.middleware');

const performanceController = new PerformanceController();
router.get('/', performanceController.getAllPerformances.bind(performanceController));
// 添加认证中间件
router.use(authMiddleware);

// 注意路由顺序：先具体后模糊
router.post('/with-customer', performanceController.createCustomerWithPerformance.bind(performanceController));
router.post('/', performanceController.createPerformance.bind(performanceController));
router.get('/:id', performanceController.getPerformanceById.bind(performanceController));
router.put('/:id', performanceController.updatePerformance.bind(performanceController));
router.delete('/:id', performanceController.deletePerformance.bind(performanceController));

module.exports = router; 