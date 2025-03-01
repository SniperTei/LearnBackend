const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/performance.controller');

router.post('/', PerformanceController.createPerformance);
router.get('/', PerformanceController.getAllPerformances);
router.get('/:id', PerformanceController.getPerformanceById);
router.put('/:id', PerformanceController.updatePerformance);
router.delete('/:id', PerformanceController.deletePerformance);

module.exports = router; 