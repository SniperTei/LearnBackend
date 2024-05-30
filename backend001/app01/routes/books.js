var express = require('express');
var router = express.Router();
var bookController = require('../controllers/bookController');

// GET /books
router.get('/book-list', bookController.bookListAPI);
// GET book detail
router.get('/book-detail/:bookId', bookController.bookDetailAPI);
// router.get('/book/detail/', bookController.bookDetail2API);
// POST add book
router.post('/book-add', bookController.addBookAPI);
// DELETE delete book
// router.delete('/book-delete/:bookId', bookController.physicalDeleteBookAPI);
router.post('/book-delete/:bookId', bookController.logicalDeleteBookAPI);
// PUT update book
router.put('/book-update/:bookId', bookController.updateBookAPI);

module.exports = router;