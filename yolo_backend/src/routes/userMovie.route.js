const express = require('express');
const router = express.Router();
const UserMovieController = require('../controllers/userMovie.controller');
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { userMovieValidation } = require('../validations/userMovie.validation');

// 所有路由都需要认证
router.use(auth());

// 获取用户观影统计
router.get('/stats', UserMovieController.getUserStats);

// 获取用户观影列表
router.get('/', validate(userMovieValidation.list), UserMovieController.listUserMovies);

// 获取特定电影的观影记录
router.get('/:movieId', validate(userMovieValidation.get), UserMovieController.getUserMovie);

// 标记观看状态
router.post('/:movieId/watch', validate(userMovieValidation.watch), UserMovieController.markAsWatched);

// 想看相关操作
router.post('/:movieId/want-to-watch', validate(userMovieValidation.wantToWatch), UserMovieController.markAsWantToWatch);
router.delete('/:movieId/want-to-watch', validate(userMovieValidation.wantToWatch), UserMovieController.removeFromWantToWatch);

// 收藏操作
router.post('/:movieId/toggle-like', validate(userMovieValidation.toggleLike), UserMovieController.toggleLike);

// 评分和评论
router.put('/:movieId/rating', validate(userMovieValidation.rating), UserMovieController.updateRating);
router.put('/:movieId/review', validate(userMovieValidation.review), UserMovieController.updateReview);

module.exports = router;
