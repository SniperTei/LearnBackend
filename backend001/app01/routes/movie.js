var express = require('express');
var router = express.Router();
var movieController = require('../controllers/movieController');

// GET /movies
router.get('/movie-list', movieController.movieList);
// GET movie detail
router.get('/movie-detail/:movieId', movieController.movieDetail);
// POST add movie
router.post('/movie-add', movieController.addMovie);
// DELETE delete movie
// router.delete('/movie-delete/:movieId', movieController.physicalDeleteMovie);
router.post('/movie-delete/:movieId', movieController.logicDeleteMovie);
// PUT update movie
router.put('/movie-update/:movieId', movieController.updateMovie);

module.exports = router;