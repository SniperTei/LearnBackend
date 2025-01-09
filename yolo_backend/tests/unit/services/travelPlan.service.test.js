const { mock } = require('jest-mock-extended');
const TravelPlanService = require('../../../src/services/travelPlan.service');
const TravelPlanDAL = require('../../../src/dal/travelPlan.dal');

// Mock the DAL
jest.mock('../../../src/dal/travelPlan.dal');

describe('TravelPlanService', () => {
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
    updatedBy: mockUserId,
    toObject: () => ({ ...mockTravelPlan })
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTravelPlan', () => {
    it('should create a travel plan successfully', async () => {
      TravelPlanDAL.create.mockResolvedValue(mockTravelPlan);

      const result = await TravelPlanService.createTravelPlan(
        {
          title: mockTravelPlan.title,
          description: mockTravelPlan.description,
          startDate: mockTravelPlan.startDate,
          endDate: mockTravelPlan.endDate,
          destination: mockTravelPlan.destination
        },
        mockUserId
      );

      expect(TravelPlanDAL.create).toHaveBeenCalledWith({
        title: mockTravelPlan.title,
        description: mockTravelPlan.description,
        startDate: mockTravelPlan.startDate,
        endDate: mockTravelPlan.endDate,
        destination: mockTravelPlan.destination,
        userId: mockUserId,
        createdBy: mockUserId,
        updatedBy: mockUserId
      });
      expect(result).toEqual(mockTravelPlan);
    });
  });

  describe('listTravelPlans', () => {
    it('should return travel plans with pagination', async () => {
      const mockResult = {
        travelPlans: [mockTravelPlan],
        total: 1
      };

      TravelPlanDAL.findAll.mockResolvedValue(mockResult);

      const result = await TravelPlanService.listTravelPlans(
        { status: 'draft' },
        { page: 1, limit: 10 },
        mockUserId
      );

      expect(TravelPlanDAL.findAll).toHaveBeenCalledWith(
        { status: 'draft', userId: mockUserId },
        { skip: 0, limit: 10, sort: { createdAt: -1 } }
      );
      expect(result).toEqual({
        travelPlans: [mockTravelPlan],
        totalPages: 1,
        currentPage: 1
      });
    });
  });

  describe('getTravelPlan', () => {
    it('should return travel plan by id', async () => {
      TravelPlanDAL.findById.mockResolvedValue(mockTravelPlan);

      const result = await TravelPlanService.getTravelPlan(mockTravelPlanId);

      expect(TravelPlanDAL.findById).toHaveBeenCalledWith(mockTravelPlanId);
      expect(result).toEqual(mockTravelPlan);
    });

    it('should throw error when travel plan not found', async () => {
      TravelPlanDAL.findById.mockResolvedValue(null);

      await expect(TravelPlanService.getTravelPlan(mockTravelPlanId))
        .rejects
        .toThrow('未找到旅行计划');
    });
  });

  describe('updateTravelPlan', () => {
    const updateData = {
      title: '更新后的东京之旅',
      status: 'published'
    };

    it('should update travel plan successfully', async () => {
      TravelPlanDAL.findById.mockResolvedValue(mockTravelPlan);
      TravelPlanDAL.update.mockResolvedValue({
        ...mockTravelPlan,
        ...updateData,
        updatedBy: mockUserId
      });

      const result = await TravelPlanService.updateTravelPlan(
        mockTravelPlanId,
        updateData,
        mockUserId
      );

      expect(TravelPlanDAL.update).toHaveBeenCalledWith(
        mockTravelPlanId,
        { ...updateData, updatedBy: mockUserId }
      );
      expect(result.title).toBe(updateData.title);
      expect(result.status).toBe(updateData.status);
    });

    it('should throw error when updating non-existent travel plan', async () => {
      TravelPlanDAL.findById.mockResolvedValue(null);

      await expect(TravelPlanService.updateTravelPlan(
        mockTravelPlanId,
        updateData,
        mockUserId
      )).rejects.toThrow('未找到旅行计划');
    });

    it('should throw error when user has no permission', async () => {
      TravelPlanDAL.findById.mockResolvedValue({
        ...mockTravelPlan,
        userId: '507f1f77bcf86cd799439013' // different user
      });

      await expect(TravelPlanService.updateTravelPlan(
        mockTravelPlanId,
        updateData,
        mockUserId
      )).rejects.toThrow('没有权限更新此旅行计划');
    });
  });

  describe('deleteTravelPlan', () => {
    it('should delete travel plan successfully', async () => {
      TravelPlanDAL.findById.mockResolvedValue(mockTravelPlan);
      TravelPlanDAL.delete.mockResolvedValue({ acknowledged: true });

      await TravelPlanService.deleteTravelPlan(mockTravelPlanId, mockUserId);

      expect(TravelPlanDAL.delete).toHaveBeenCalledWith(mockTravelPlanId);
    });

    it('should throw error when deleting non-existent travel plan', async () => {
      TravelPlanDAL.findById.mockResolvedValue(null);

      await expect(TravelPlanService.deleteTravelPlan(
        mockTravelPlanId,
        mockUserId
      )).rejects.toThrow('未找到旅行计划');
    });

    it('should throw error when user has no permission', async () => {
      TravelPlanDAL.findById.mockResolvedValue({
        ...mockTravelPlan,
        userId: '507f1f77bcf86cd799439013' // different user
      });

      await expect(TravelPlanService.deleteTravelPlan(
        mockTravelPlanId,
        mockUserId
      )).rejects.toThrow('没有权限删除此旅行计划');
    });
  });
});
