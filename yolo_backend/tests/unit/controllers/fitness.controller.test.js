const FitnessController = require('../../../src/controllers/fitness.controller');
const FitnessService = require('../../../src/services/fitness.service');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/fitness.service');

describe('FitnessController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new FitnessController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: {
        userId: 'testUserId',
        username: 'testUser'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFitness', () => {
    const validFitnessData = {
      exerciseType: 'running',
      duration: 30,
      intensity: 'medium',
      caloriesBurned: 300,
      exerciseDate: new Date().toISOString()
    };

    it('should create fitness record successfully', async () => {
      mockReq.body = validFitnessData;
      const expectedFitness = { ...validFitnessData, _id: 'testFitnessId' };

      jest.spyOn(controller.fitnessService, 'createFitness')
        .mockResolvedValue(expectedFitness);

      await controller.createFitness(mockReq, mockRes);

      expect(controller.fitnessService.createFitness).toHaveBeenCalledWith({
        ...validFitnessData,
        userId: 'testUserId',
        createdBy: 'testUser',
        updatedBy: 'testUser'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedFitness
        })
      );
    });

    it('should handle validation error', async () => {
      mockReq.body = validFitnessData;
      const validationError = new Error('Invalid data');
      validationError.name = 'ValidationError';

      jest.spyOn(controller.fitnessService, 'createFitness')
        .mockRejectedValue(validationError);

      await controller.createFitness(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00400',
          msg: expect.stringContaining('数据验证失败')
        })
      );
    });
  });

  describe('getAllFitness', () => {
    it('should get fitness records with default pagination', async () => {
      const mockResult = {
        records: [{ _id: 'testFitnessId' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      jest.spyOn(controller.fitnessService, 'getAllFitness')
        .mockResolvedValue(mockResult);

      await controller.getAllFitness(mockReq, mockRes);

      expect(controller.fitnessService.getAllFitness).toHaveBeenCalledWith(
        { userId: 'testUserId' },
        {
          page: 1,
          limit: 10,
          sort: { exerciseDate: -1 }
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });

    it('should apply filters when provided', async () => {
      mockReq.query = {
        page: '2',
        limit: '20',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        exerciseType: 'running',
        intensity: 'high',
        sortBy: 'duration',
        order: 'asc'
      };

      const mockResult = {
        records: [{ _id: 'testFitnessId' }],
        total: 1,
        page: 2,
        totalPages: 1
      };

      jest.spyOn(controller.fitnessService, 'getAllFitness')
        .mockResolvedValue(mockResult);

      await controller.getAllFitness(mockReq, mockRes);

      expect(controller.fitnessService.getAllFitness).toHaveBeenCalledWith(
        {
          userId: 'testUserId',
          exerciseDate: {
            $gte: expect.any(Date),
            $lte: expect.any(Date)
          },
          exerciseType: 'running',
          intensity: 'high'
        },
        {
          page: 2,
          limit: 20,
          sort: { duration: 1 }
        }
      );
    });
  });

  describe('getFitnessById', () => {
    it('should get fitness by id successfully', async () => {
      const fitnessId = 'testFitnessId';
      mockReq.params.id = fitnessId;
      const mockFitness = {
        _id: fitnessId,
        userId: {
          _id: mockReq.user.userId
        }
      };

      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(mockFitness);

      await controller.getFitnessById(mockReq, mockRes);

      expect(controller.fitnessService.getFitnessById).toHaveBeenCalledWith(fitnessId);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockFitness
        })
      );
    });

    it('should return 404 when fitness not found', async () => {
      mockReq.params.id = 'nonexistentId';
      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(null);

      await controller.getFitnessById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00404',
          msg: '运动记录不存在'
        })
      );
    });

    it('should return 403 when accessing unauthorized fitness', async () => {
      mockReq.params.id = 'testFitnessId';
      const mockFitness = {
        _id: 'testFitnessId',
        userId: {
          _id: 'differentUserId'
        }
      };

      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(mockFitness);

      await controller.getFitnessById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: '无权访问此运动记录'
        })
      );
    });
  });

  describe('updateFitness', () => {
    const updateData = {
      duration: 45,
      caloriesBurned: 400
    };

    it('should update fitness successfully', async () => {
      mockReq.params.id = 'testFitnessId';
      mockReq.body = updateData;
      const mockFitness = {
        _id: 'testFitnessId',
        userId: {
          _id: mockReq.user.userId
        }
      };
      const updatedFitness = { ...mockFitness, ...updateData };

      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(mockFitness);
      jest.spyOn(controller.fitnessService, 'updateFitness')
        .mockResolvedValue(updatedFitness);

      await controller.updateFitness(mockReq, mockRes);

      expect(controller.fitnessService.updateFitness).toHaveBeenCalledWith(
        'testFitnessId',
        expect.objectContaining({
          ...updateData,
          updatedBy: 'testUser'
        })
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: updatedFitness
        })
      );
    });
  });

  describe('deleteFitness', () => {
    it('should delete fitness successfully', async () => {
      mockReq.params.id = 'testFitnessId';
      const mockFitness = {
        _id: 'testFitnessId',
        userId: {
          _id: mockReq.user.userId
        }
      };

      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(mockFitness);
      jest.spyOn(controller.fitnessService, 'deleteFitness')
        .mockResolvedValue(true);

      await controller.deleteFitness(mockReq, mockRes);

      expect(controller.fitnessService.deleteFitness).toHaveBeenCalledWith('testFitnessId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: '运动记录删除成功'
        })
      );
    });

    it('should return 403 when deleting unauthorized fitness', async () => {
      mockReq.params.id = 'testFitnessId';
      const mockFitness = {
        _id: 'testFitnessId',
        userId: {
          _id: 'differentUserId'
        }
      };

      jest.spyOn(controller.fitnessService, 'getFitnessById')
        .mockResolvedValue(mockFitness);

      await controller.deleteFitness(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: '无权删除此运动记录'
        })
      );
    });
  });
});
