const express = require('express');
const router = express.Router();
const fitnessController = require('../controllers/fitness.controller');
const auth = require('../middleware/auth');

// 所有运动相关的路由都需要认证
router.use(auth);

// 创建运动记录
router.post('/create', fitnessController.createFitness);

// 获取当前用户的所有运动记录，支持分页和过滤
router.get('/list', fitnessController.getAllFitness);

// 获取单个运动记录详情
router.get('/query/:id', fitnessController.getFitnessById);

// 更新运动记录
router.put('/update/:id', fitnessController.updateFitness);

// 删除运动记录
router.delete('/delete/:id', fitnessController.deleteFitness);

module.exports = router;
