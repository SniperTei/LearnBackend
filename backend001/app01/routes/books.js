var express = require('express');
var router = express.Router();
var bookController = require('../controllers/bookController');

// GET /books
router.get('/book-list', bookController.bookListAPI);

module.exports = router;