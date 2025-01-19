const express = require('express');
const router = express.Router();
const FitnessController = require('../controllers/fitness.controller');
const auth = require('../middleware/auth');

// 所有运动相关的路由都需要认证
router.use(auth);

// Create a new instance of the controller
const fitnessController = new FitnessController();

// 创建运动记录
router.post('/create', fitnessController.createFitness.bind(fitnessController));

// 获取当前用户的所有运动记录，支持分页和过滤
router.get('/list', fitnessController.getAllFitness.bind(fitnessController));

// 获取单个运动记录详情
router.get('/query/:id', fitnessController.getFitnessById.bind(fitnessController));

// 更新运动记录
router.put('/update/:id', fitnessController.updateFitness.bind(fitnessController));

// 删除运动记录
router.delete('/delete/:id', fitnessController.deleteFitness.bind(fitnessController));

module.exports = router;
