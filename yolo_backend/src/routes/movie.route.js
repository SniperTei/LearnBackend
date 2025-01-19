const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movie.controller');
const auth = require('../middleware/auth');

// create a new instance of the controller
const movieController = new MovieController();

// 公开路由
router.get('/list', movieController.listMovies.bind(movieController));
router.get('/query/:id', movieController.getMovie.bind(movieController));

// 需要认证的路由
router.use(auth);
router.post('/create', movieController.createMovie.bind(movieController));
router.put('/update/:id', movieController.updateMovie.bind(movieController));
router.delete('/delete/:id', movieController.deleteMovie.bind(movieController));

module.exports = router;
