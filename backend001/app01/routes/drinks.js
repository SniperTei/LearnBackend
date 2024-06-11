var express = require('express');
var router = express.Router();
var drinkController = require('../controllers/drinkController');

// GET /drinks
router.get('/drink-list', drinkController.drinkListAPI);
// add a new drink
router.post('/add-drink', drinkController.addDrinkAPI);

module.exports = router;