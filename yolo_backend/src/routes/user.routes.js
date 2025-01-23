const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Create a new instance of the controller
const userController = new UserController();

// 公开路由
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// 需要认证的路由
router.use(auth);

// 用户资料相关路由
router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.delete('/soft-delete', userController.softDeleteUser.bind(userController));

// 管理员路由
router.use(adminAuth);
router.get('/list', userController.listUsers.bind(userController));
router.get('/:userId/menus', userController.getUserMenus.bind(userController));
router.put('/:userId/menus', userController.updateUserMenus.bind(userController));

module.exports = router;
