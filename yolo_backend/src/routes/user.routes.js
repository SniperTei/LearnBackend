const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Create a new instance of the controller
const userController = new UserController();

// 公开路由
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// 需要认证的路由
router.get('/profile', auth, userController.getProfile.bind(userController));
// router.patch('/profile', auth, userController.updateProfile.bind(userController));
router.delete('/soft-delete', auth, userController.softDeleteUser.bind(userController));
// router.delete('/hard-delete', auth, userController.hardDeleteUser.bind(userController));

module.exports = router;
