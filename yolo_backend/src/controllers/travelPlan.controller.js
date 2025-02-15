const TravelPlanService = require('../services/travelPlan.service');
const ApiResponse = require('../utils/response');

class TravelPlanController {
  constructor() {
    this.travelPlanService = new TravelPlanService();
  }

  async listTravelPlans(req, res, next) {
    try {
      const { page = 1, limit = 10, status, destination } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (destination) {
        filters['destination.country'] = destination.country;
        if (destination.city) filters['destination.city'] = destination.city;
      }

      const result = await this.travelPlanService.listTravelPlans(
        filters,
        { page, limit },
        req.user.userId
      );

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  async queryTravelPlan(req, res, next) {
    try {
      const travelPlan = await this.travelPlanService.getTravelPlan(
        req.params.id,
        req.user.userId
      );
      if (!travelPlan) {
        return res.status(404).json(ApiResponse.notFound('未找到旅行计划'));
      }
      res.json(ApiResponse.success(travelPlan));
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json(ApiResponse.notFound(error.message));
      }
      next(error);
    }
  }

  async createTravelPlan(req, res, next) {
    try {
      const travelPlan = await this.travelPlanService.createTravelPlan(
        req.body,
        req.user.userId
      );
      res.status(201).json(ApiResponse.success(travelPlan, '旅行计划创建成功'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.badRequest(error.message));
      }
      next(error);
    }
  }

  async updateTravelPlan(req, res, next) {
    try {
      const travelPlan = await this.travelPlanService.updateTravelPlan(
        req.params.id,
        req.body,
        req.user.userId
      );
      if (!travelPlan) {
        return res.status(404).json(ApiResponse.notFound('未找到旅行计划'));
      }
      if (travelPlan.userId.toString() !== req.user.userId.toString()) {
        return res.status(403).json(ApiResponse.forbidden('没有权限更新此旅行计划'));
      }
      res.json(ApiResponse.success(travelPlan, '旅行计划更新成功'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.badRequest(error.message));
      }
      next(error);
    }
  }

  async deleteTravelPlan(req, res, next) {
    try {
      const travelPlan = await this.travelPlanService.getTravelPlan(req.params.id);
      if (!travelPlan) {
        return res.status(404).json(ApiResponse.notFound('未找到旅行计划'));
      }
      if (travelPlan.userId.toString() !== req.user.userId.toString()) {
        return res.status(403).json(ApiResponse.forbidden('没有权限删除此旅行计划'));
      }
      await this.travelPlanService.deleteTravelPlan(req.params.id, req.user.userId);
      res.json(ApiResponse.success(null, '旅行计划删除成功'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TravelPlanController;
