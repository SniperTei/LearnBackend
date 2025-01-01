const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// 公开路由
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// 需要认证的路由
router.get('/profile', auth, UserController.getProfile);
router.patch('/profile', auth, UserController.updateProfile);
router.delete('/soft-delete', auth, UserController.softDeleteUser);
router.delete('/hard-delete', auth, UserController.hardDeleteUser);

module.exports = router;
