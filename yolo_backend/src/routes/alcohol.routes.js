const express = require('express');
const router = express.Router();
const alcoholController = require('../controllers/alcohol.controller');
const auth = require('../middleware/auth');

// 所有酒类相关的路由都需要认证
router.use(auth);

// 创建酒类
router.post('/create', alcoholController.createAlcohol);

// 获取酒类列表，支持分页和过滤
router.get('/list', alcoholController.getAllAlcohols);

// 获取单个酒类详情
router.get('/:id', alcoholController.getAlcoholById);

// 更新酒类
router.put('/:id', alcoholController.updateAlcohol);

// 删除酒类
router.delete('/:id', alcoholController.deleteAlcohol);

module.exports = router;
