const express = require('express');
const router = express.Router();
const UserMovieController = require('../controllers/userMovie.controller');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { userMovieValidation } = require('../validations/userMovie.validation');

// 所有路由都需要认证
router.use(auth);

// 获取用户观影统计
router.get('/stats', UserMovieController.getUserStats);

// 获取用户观影列表
router.get('/list', validate(userMovieValidation.list), UserMovieController.listUserMovies);

// 获取特定电影的观影记录
router.get('/query/:movieId', validate(userMovieValidation.get), UserMovieController.getUserMovie);

// 标记观看状态
router.post('/watch/:movieId', validate(userMovieValidation.watch), UserMovieController.markAsWatched);

// 想看相关操作
router.post('/want-to-watch/:movieId', validate(userMovieValidation.wantToWatch), UserMovieController.markAsWantToWatch);
router.delete('/want-to-watch/:movieId', validate(userMovieValidation.wantToWatch), UserMovieController.removeFromWantToWatch);

// 收藏操作
router.post('/toggle-like/:movieId', validate(userMovieValidation.toggleLike), UserMovieController.toggleLike);

// 评分和评论
router.put('/rating/:movieId', validate(userMovieValidation.rating), UserMovieController.updateRating);
router.put('/review/:movieId', validate(userMovieValidation.review), UserMovieController.updateReview);

module.exports = router;
