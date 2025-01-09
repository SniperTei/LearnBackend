const TravelPlanService = require('../services/travelPlan.service');
const ApiResponse = require('../utils/response');

exports.listTravelPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, destination } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (destination) {
      filters['destination.country'] = destination.country;
      if (destination.city) filters['destination.city'] = destination.city;
    }

    const result = await TravelPlanService.listTravelPlans(
      filters,
      { page, limit },
      req.user.userId
    );

    res.json(ApiResponse.success(result));
  } catch (error) {
    next(error);
  }
};

exports.queryTravelPlan = async (req, res, next) => {
  try {
    const travelPlan = await TravelPlanService.getTravelPlan(req.params.id);
    if (!travelPlan) {
      return res.status(404).json(ApiResponse.notFound('未找到旅行计划'));
    }
    res.json(ApiResponse.success(travelPlan));
  } catch (error) {
    next(error);
  }
};

exports.createTravelPlan = async (req, res, next) => {
  try {
    const travelPlan = await TravelPlanService.createTravelPlan(
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
};

exports.updateTravelPlan = async (req, res, next) => {
  try {
    const travelPlan = await TravelPlanService.updateTravelPlan(
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
};

exports.deleteTravelPlan = async (req, res, next) => {
  try {
    const travelPlan = await TravelPlanService.getTravelPlan(req.params.id);
    if (!travelPlan) {
      return res.status(404).json(ApiResponse.notFound('未找到旅行计划'));
    }
    if (travelPlan.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json(ApiResponse.forbidden('没有权限删除此旅行计划'));
    }
    await TravelPlanService.deleteTravelPlan(req.params.id, req.user.userId);
    res.json(ApiResponse.success(null, '旅行计划删除成功'));
  } catch (error) {
    next(error);
  }
};
