const { mockRequest, mockResponse } = require('jest-mock-extended');
const TravelPlanController = require('../../../src/controllers/travelPlan.controller');
const TravelPlanService = require('../../../src/services/travelPlan.service');

// Mock the service
jest.mock('../../../src/services/travelPlan.service');

describe('TravelPlanController', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockTravelPlanId = '507f1f77bcf86cd799439012';

  const mockTravelPlan = {
    _id: mockTravelPlanId,
    title: '日本东京之旅',
    description: '一次难忘的东京之旅',
    startDate: '2025-03-01',
    endDate: '2025-03-07',
    destination: {
      country: '日本',
      city: '东京',
      locations: ['浅草寺', '秋叶原', '银座']
    },
    userId: mockUserId,
    createdBy: mockUserId,
    updatedBy: mockUserId
  };

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();

    // 设置默认的用户认证信息
    req.user = { userId: mockUserId };
  });

  describe('listTravelPlans', () => {
    it('should return travel plans list successfully', async () => {
      const mockResult = {
        travelPlans: [mockTravelPlan],
        totalPages: 1,
        currentPage: 1
      };

      TravelPlanService.listTravelPlans.mockResolvedValue(mockResult);

      req.query = { page: '1', limit: '10' };
      await TravelPlanController.listTravelPlans(req, res, next);

      expect(TravelPlanService.listTravelPlans).toHaveBeenCalledWith(
        {},
        { page: '1', limit: '10' },
        mockUserId
      );
      expect(res.json).toHaveBeenCalledWith({
        code: '000000',
        statusCode: 200,
        msg: 'Success',
        data: mockResult
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      TravelPlanService.listTravelPlans.mockRejectedValue(error);

      await TravelPlanController.listTravelPlans(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('queryTravelPlan', () => {
    it('should return travel plan successfully', async () => {
      TravelPlanService.getTravelPlan.mockResolvedValue(mockTravelPlan);

      req.params = { id: mockTravelPlanId };
      await TravelPlanController.queryTravelPlan(req, res, next);

      expect(TravelPlanService.getTravelPlan).toHaveBeenCalledWith(mockTravelPlanId);
      expect(res.json).toHaveBeenCalledWith({
        code: '000000',
        statusCode: 200,
        msg: 'Success',
        data: mockTravelPlan
      });
    });

    it('should handle not found error', async () => {
      const error = new Error('未找到旅行计划');
      TravelPlanService.getTravelPlan.mockRejectedValue(error);

      req.params = { id: mockTravelPlanId };
      await TravelPlanController.queryTravelPlan(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createTravelPlan', () => {
    it('should create travel plan successfully', async () => {
      TravelPlanService.createTravelPlan.mockResolvedValue(mockTravelPlan);

      req.body = {
        title: mockTravelPlan.title,
        description: mockTravelPlan.description,
        startDate: mockTravelPlan.startDate,
        endDate: mockTravelPlan.endDate,
        destination: mockTravelPlan.destination
      };

      await TravelPlanController.createTravelPlan(req, res, next);

      expect(TravelPlanService.createTravelPlan).toHaveBeenCalledWith(
        req.body,
        mockUserId
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: '000000',
        statusCode: 200,
        msg: '旅行计划创建成功',
        data: mockTravelPlan
      });
    });

    it('should handle validation error', async () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      TravelPlanService.createTravelPlan.mockRejectedValue(error);

      await TravelPlanController.createTravelPlan(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: '400000',
        statusCode: 400,
        msg: 'Validation failed'
      });
    });
  });

  describe('updateTravelPlan', () => {
    it('should update travel plan successfully', async () => {
      const updatedTravelPlan = { ...mockTravelPlan, title: '更新后的东京之旅' };
      TravelPlanService.updateTravelPlan.mockResolvedValue(updatedTravelPlan);

      req.params = { id: mockTravelPlanId };
      req.body = { title: '更新后的东京之旅' };

      await TravelPlanController.updateTravelPlan(req, res, next);

      expect(TravelPlanService.updateTravelPlan).toHaveBeenCalledWith(
        mockTravelPlanId,
        req.body,
        mockUserId
      );
      expect(res.json).toHaveBeenCalledWith({
        code: '000000',
        statusCode: 200,
        msg: '旅行计划更新成功',
        data: updatedTravelPlan
      });
    });

    it('should handle validation error', async () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      TravelPlanService.updateTravelPlan.mockRejectedValue(error);

      req.params = { id: mockTravelPlanId };
      await TravelPlanController.updateTravelPlan(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: '400000',
        statusCode: 400,
        msg: 'Validation failed'
      });
    });
  });

  describe('deleteTravelPlan', () => {
    it('should delete travel plan successfully', async () => {
      TravelPlanService.deleteTravelPlan.mockResolvedValue();

      req.params = { id: mockTravelPlanId };
      await TravelPlanController.deleteTravelPlan(req, res, next);

      expect(TravelPlanService.deleteTravelPlan).toHaveBeenCalledWith(
        mockTravelPlanId,
        mockUserId
      );
      expect(res.json).toHaveBeenCalledWith({
        code: '000000',
        statusCode: 200,
        msg: '旅行计划删除成功',
        data: null
      });
    });

    it('should handle error', async () => {
      const error = new Error('Delete failed');
      TravelPlanService.deleteTravelPlan.mockRejectedValue(error);

      req.params = { id: mockTravelPlanId };
      await TravelPlanController.deleteTravelPlan(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
