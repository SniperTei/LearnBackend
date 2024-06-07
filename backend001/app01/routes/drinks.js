var express = require('express');
var router = express.Router();
var drinkController = require('../controllers/drinkController');

// GET /drinks
router.get('/drink-list', drinkController.drinkListAPI);

module.exports = router;