const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionary.controller');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 根据分组获取字典数据，使用查询参数
router.get('/', dictionaryController.getDictionariesByGroups);

module.exports = router;
