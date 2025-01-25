const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menu.controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const menuController = new MenuController();

// 所有菜单路由都需要认证和管理员权限
router.use(auth);
router.use(adminAuth);

// 菜单管理路由
router.post('/', menuController.createMenu.bind(menuController));
router.put('/:code', menuController.updateMenu.bind(menuController));
router.delete('/:code', menuController.deleteMenu.bind(menuController));
router.get('/tree', menuController.getMenuTree.bind(menuController));
router.get('/all', menuController.getAllMenus.bind(menuController));

module.exports = router;
