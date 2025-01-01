const express = require('express');
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.use(auth);
router.get('/profile', UserController.getProfile);
router.delete('/delete', UserController.deleteUser);

module.exports = router;
