const AlcoholController = require('../../../src/controllers/alcohol.controller');
const AlcoholService = require('../../../src/services/alcohol.service');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/alcohol.service');

describe('AlcoholController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new AlcoholController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { 
        _id: 'testUserId',
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

  describe('createAlcohol', () => {
    const validAlcoholData = {
      name: 'Test Alcohol',
      type: 'Wine',
      brand: 'Test Brand',
      alcoholContent: 13.5,
      volume: 750,
      volumeUnit: 'ml'
    };

    it('should create alcohol successfully', async () => {
      mockReq.body = validAlcoholData;
      const expectedAlcohol = { ...validAlcoholData, _id: 'testAlcoholId' };
      
      jest.spyOn(controller.alcoholService, 'createAlcohol')
        .mockResolvedValue(expectedAlcohol);

      await controller.createAlcohol(mockReq, mockRes);

      expect(controller.alcoholService.createAlcohol).toHaveBeenCalledWith({
        ...validAlcoholData,
        createdBy: 'testUser',
        updatedBy: 'testUser'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedAlcohol
        })
      );
    });

    it('should return 400 when required fields are missing', async () => {
      mockReq.body = { name: 'Test Alcohol' }; // Missing required fields

      await controller.createAlcohol(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: expect.stringContaining('Missing required fields')
        })
      );
    });

    it('should handle validation errors', async () => {
      mockReq.body = validAlcoholData;
      const validationError = new Error('Invalid data');
      validationError.name = 'ValidationError';
      
      jest.spyOn(controller.alcoholService, 'createAlcohol')
        .mockRejectedValue(validationError);

      await controller.createAlcohol(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: expect.stringContaining('Validation failed')
        })
      );
    });
  });

  describe('getAllAlcohols', () => {
    it('should get alcohols with default pagination', async () => {
      const mockAlcohols = {
        alcohols: [{ name: 'Test Alcohol' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      jest.spyOn(controller.alcoholService, 'getAllAlcohols')
        .mockResolvedValue(mockAlcohols);

      await controller.getAllAlcohols(mockReq, mockRes);

      expect(controller.alcoholService.getAllAlcohols).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockAlcohols
        })
      );
    });

    it('should apply filters when provided', async () => {
      mockReq.query = {
        page: 2,
        limit: 20,
        type: 'Wine',
        brand: 'Test Brand',
        minAlcoholContent: 10,
        maxAlcoholContent: 15
      };

      const mockAlcohols = {
        alcohols: [{ name: 'Test Wine' }],
        total: 1,
        page: 2,
        totalPages: 1
      };

      jest.spyOn(controller.alcoholService, 'getAllAlcohols')
        .mockResolvedValue(mockAlcohols);

      await controller.getAllAlcohols(mockReq, mockRes);

      expect(controller.alcoholService.getAllAlcohols).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockAlcohols
        })
      );
    });
  });
});
