const express = require('express');
const router = express.Router();
const AlcoholController = require('../controllers/alcohol.controller');
const auth = require('../middleware/auth');

// Create a new instance of the controller
const alcoholController = new AlcoholController();

// 所有酒类相关的路由都需要认证
router.use(auth);

// 创建酒类
router.post('/create', alcoholController.createAlcohol.bind(alcoholController));

// 获取酒类列表，支持分页和过滤
router.get('/list', alcoholController.getAllAlcohols.bind(alcoholController));

// 获取单个酒类详情
router.get('/query/:id', alcoholController.getAlcoholById.bind(alcoholController));

// 更新酒类
router.put('/update/:id', alcoholController.updateAlcohol.bind(alcoholController));

// 删除酒类
router.delete('/delete/:id', alcoholController.deleteAlcohol.bind(alcoholController));

module.exports = router;
