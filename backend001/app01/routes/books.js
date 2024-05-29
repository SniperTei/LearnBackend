var express = require('express');
var router = express.Router();
var bookController = require('../controllers/bookController');

// GET /books
router.get('/book-list', bookController.bookListAPI);
// GET book detail
router.get('/book/detail/:bookId', bookController.bookDetailAPI);
// POST add book
router.post('/book/add', bookController.addBookAPI);
// PUT update book
router.put('/book/update/:bookId', bookController.updateBookAPI);

module.exports = router;