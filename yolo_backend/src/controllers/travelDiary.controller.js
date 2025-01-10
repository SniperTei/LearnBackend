const TravelDiaryService = require('../services/travelDiary.service');
const ApiResponse = require('../utils/response');

exports.listDiaries = async (req, res, next) => {
  try {
    const { page, limit, tags, location } = req.query;
    const filters = {};

    if (tags) filters.tags = { $in: tags.split(',') };
    if (location) {
      if (location.country) filters['location.country'] = location.country;
      if (location.city) filters['location.city'] = location.city;
    }

    const result = await TravelDiaryService.listDiaries(
      filters,
      { page, limit },
      req.user.userId
    );

    res.json(ApiResponse.success(result));
  } catch (error) {
    next(error);
  }
};

exports.getDiary = async (req, res, next) => {
  try {
    const diary = await TravelDiaryService.getDiary(req.params.id);
    res.json(ApiResponse.success(diary));
  } catch (error) {
    next(error);
  }
};

exports.createDiary = async (req, res, next) => {
  try {
    const diary = await TravelDiaryService.createDiary(
      req.body,
      req.user.userId
    );
    res.status(201).json(ApiResponse.success(diary, '游记创建成功', 201));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json(ApiResponse.badRequest(error.message));
    }
    next(error);
  }
};

exports.updateDiary = async (req, res, next) => {
  try {
    const diary = await TravelDiaryService.updateDiary(
      req.params.id,
      req.body,
      req.user.userId
    );
    res.json(ApiResponse.success(diary, '游记更新成功'));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json(ApiResponse.badRequest(error.message));
    }
    next(error);
  }
};

exports.deleteDiary = async (req, res, next) => {
  try {
    await TravelDiaryService.deleteDiary(req.params.id, req.user.userId);
    res.json(ApiResponse.success(null, '游记删除成功'));
  } catch (error) {
    next(error);
  }
};
