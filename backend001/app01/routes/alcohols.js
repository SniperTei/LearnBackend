var express = require('express');
var router = express.Router();
var alcoholController = require('../controllers/alcoholController');

// GET /alcohols
router.get('/alcohol-list', alcoholController.alcoholList);

module.exports = router;