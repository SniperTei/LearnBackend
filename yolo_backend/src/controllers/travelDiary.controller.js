const TravelDiaryService = require('../services/travelDiary.service');
const ApiResponse = require('../utils/response');

class TravelDiaryController {
  constructor() {
    this.travelDiaryService = new TravelDiaryService();
  }

  async listDiaries(req, res, next) {
    try {
      const { page, limit, tags, location } = req.query;
      const filters = {};

      if (tags) filters.tags = { $in: tags.split(',') };
      if (location) {
        if (location.country) filters['location.country'] = location.country;
        if (location.city) filters['location.city'] = location.city;
      }

      const result = await this.travelDiaryService.listDiaries(
        filters,
        { page, limit },
        req.user.userId
      );

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getDiary(req, res, next) {
    try {
      const diary = await this.travelDiaryService.getDiary(req.params.id);
      res.json(ApiResponse.success(diary));
    } catch (error) {
      next(error);
    }
  }

  async createDiary(req, res, next) {
    try {
      const diary = await this.travelDiaryService.createDiary(
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
  }

  async updateDiary(req, res, next) {
    try {
      const diary = await this.travelDiaryService.updateDiary(
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
  }

  async deleteDiary(req, res, next) {
    try {
      await this.travelDiaryService.deleteDiary(req.params.id, req.user.userId);
      res.json(ApiResponse.success(null, '游记删除成功'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TravelDiaryController();
