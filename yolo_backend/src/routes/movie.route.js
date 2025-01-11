const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movie.controller');
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { movieValidation } = require('../validations/movie.validation');

// 公开路由
router.get('/search', validate(movieValidation.search), MovieController.searchMovies);
router.get('/list', validate(movieValidation.list), MovieController.listMovies);
router.get('/query/:id', validate(movieValidation.get), MovieController.getMovie);

// 需要认证的路由
router.use(auth());
router.post('/create', validate(movieValidation.create), MovieController.createMovie);
router.put('/update/:id', validate(movieValidation.update), MovieController.updateMovie);
router.delete('/delete/:id', validate(movieValidation.delete), MovieController.deleteMovie);

module.exports = router;
