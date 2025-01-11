const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movie.controller');
const auth = require('../middleware/auth');

// 公开路由
router.get('/list', MovieController.listMovies);
router.get('/query/:id', MovieController.getMovie);

// 需要认证的路由
router.use(auth);
router.post('/create', MovieController.createMovie);
router.put('/update/:id', MovieController.updateMovie);
router.delete('/delete/:id', MovieController.deleteMovie);

module.exports = router;
