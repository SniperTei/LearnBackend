var express = require('express');
var router = express.Router();
var bookController = require('../controllers/bookController');

// GET /books
router.get('/book-list', bookController.bookListAPI);
// GET book detail
router.get('/book/detail/:bookId', bookController.bookDetailAPI);

module.exports = router;