const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const travelPlanController = require('../controllers/travelPlan.controller');

// 所有旅行计划相关的路由都需要认证
router.use(auth);

// 创建旅行计划
router.post('/create', travelPlanController.createTravelPlan);

// 获取旅行计划列表，支持分页和过滤
router.get('/list', travelPlanController.listTravelPlans);

// 获取单个旅行计划详情
router.get('/query/:id', travelPlanController.queryTravelPlan);

// 更新旅行计划
router.put('/update/:id', travelPlanController.updateTravelPlan);

// 删除旅行计划
router.delete('/delete/:id', travelPlanController.deleteTravelPlan);

module.exports = router;
