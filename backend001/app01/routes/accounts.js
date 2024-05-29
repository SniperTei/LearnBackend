var express = require('express');
var router = express.Router();
var accountController = require('../controllers/accountController');

// login
router.post('/login', accountController.loginAPI);
// register
router.post('/register', accountController.registerAPI);

module.exports = router;
