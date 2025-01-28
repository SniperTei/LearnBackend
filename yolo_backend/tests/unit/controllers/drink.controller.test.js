const DrinkController = require('../../../src/controllers/drink.controller');
const DrinkService = require('../../../src/services/drink.service');
const Alcohol = require('../../../src/models/alcohol.model');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/drink.service');
jest.mock('../../../src/models/alcohol.model');

describe('DrinkController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new DrinkController();
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

  describe('createDrink', () => {
    const validDrinkData = {
      alcoholId: 'testAlcoholId',
      amount: 200,
      unit: 'ml',
      drinkTime: new Date().toISOString()
    };

    it('should create drink record successfully', async () => {
      mockReq.body = validDrinkData;
      const mockAlcohol = { _id: validDrinkData.alcoholId };
      const expectedDrink = { ...validDrinkData, _id: 'testDrinkId' };

      Alcohol.findById.mockResolvedValue(mockAlcohol);
      jest.spyOn(controller.drinkService, 'createDrink')
        .mockResolvedValue(expectedDrink);

      await controller.createDrink(mockReq, mockRes);

      expect(Alcohol.findById).toHaveBeenCalledWith(validDrinkData.alcoholId);
      expect(controller.drinkService.createDrink).toHaveBeenCalledWith({
        ...validDrinkData,
        userId: 'testUserId',
        createdBy: 'testUser',
        updatedBy: 'testUser'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedDrink
        })
      );
    });

    it('should return 400 when required fields are missing', async () => {
      mockReq.body = { amount: 200 }; // Missing required fields

      await controller.createDrink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00400',
          msg: expect.stringContaining('Missing required fields')
        })
      );
    });

    it('should return 404 when alcohol not found', async () => {
      mockReq.body = validDrinkData;
      Alcohol.findById.mockResolvedValue(null);

      await controller.createDrink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00404',
          msg: 'Alcohol not found'
        })
      );
    });
  });

  describe('getAllDrinks', () => {
    it('should get drinks with default pagination', async () => {
      const mockDrinks = {
        drinks: [{ _id: 'testDrinkId' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      jest.spyOn(controller.drinkService, 'getAllDrinks')
        .mockResolvedValue(mockDrinks);

      await controller.getAllDrinks(mockReq, mockRes);

      expect(controller.drinkService.getAllDrinks).toHaveBeenCalledWith(
        { userId: 'testUserId' },
        {
          page: 1,
          limit: 10,
          sort: { drinkTime: -1 }
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockDrinks
        })
      );
    });

    it('should apply filters when provided', async () => {
      mockReq.query = {
        page: '2',
        limit: '20',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        mood: 'happy',
        occasion: 'party',
        sortBy: 'amount',
        order: 'asc'
      };

      const mockDrinks = {
        drinks: [{ _id: 'testDrinkId' }],
        total: 1,
        page: 2,
        totalPages: 1
      };

      jest.spyOn(controller.drinkService, 'getAllDrinks')
        .mockResolvedValue(mockDrinks);

      await controller.getAllDrinks(mockReq, mockRes);

      expect(controller.drinkService.getAllDrinks).toHaveBeenCalledWith(
        {
          userId: 'testUserId',
          drinkTime: {
            $gte: expect.any(Date),
            $lte: expect.any(Date)
          },
          mood: 'happy',
          occasion: 'party'
        },
        {
          page: 2,
          limit: 20,
          sort: { amount: 1 }
        }
      );
    });
  });

  describe('getDrinkById', () => {
    it('should get drink by id successfully', async () => {
      const drinkId = 'testDrinkId';
      mockReq.params.id = drinkId;
      const mockDrink = {
        _id: drinkId,
        userId: mockReq.user.userId
      };

      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(mockDrink);

      await controller.getDrinkById(mockReq, mockRes);

      expect(controller.drinkService.getDrinkById).toHaveBeenCalledWith(drinkId);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockDrink
        })
      );
    });

    it('should return 404 when drink not found', async () => {
      mockReq.params.id = 'nonexistentId';
      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(null);

      await controller.getDrinkById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00404',
          msg: 'Drink record not found'
        })
      );
    });

    it('should return 403 when accessing unauthorized drink', async () => {
      mockReq.params.id = 'testDrinkId';
      const mockDrink = {
        _id: 'testDrinkId',
        userId: 'differentUserId'
      };

      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(mockDrink);

      await controller.getDrinkById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: expect.stringContaining('permission')
        })
      );
    });
  });

  describe('updateDrink', () => {
    const updateData = {
      amount: 300,
      unit: 'ml'
    };

    it('should update drink successfully', async () => {
      mockReq.params.id = 'testDrinkId';
      mockReq.body = updateData;
      const mockDrink = {
        _id: 'testDrinkId',
        userId: mockReq.user.userId
      };
      const updatedDrink = { ...mockDrink, ...updateData };

      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(mockDrink);
      jest.spyOn(controller.drinkService, 'updateDrink')
        .mockResolvedValue(updatedDrink);

      await controller.updateDrink(mockReq, mockRes);

      expect(controller.drinkService.updateDrink).toHaveBeenCalledWith(
        'testDrinkId',
        expect.objectContaining({
          ...updateData,
          updatedBy: 'testUser',
          updatedAt: expect.any(Date)
        })
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: updatedDrink
        })
      );
    });
  });

  describe('deleteDrink', () => {
    it('should delete drink successfully', async () => {
      mockReq.params.id = 'testDrinkId';
      const mockDrink = {
        _id: 'testDrinkId',
        userId: mockReq.user.userId
      };

      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(mockDrink);
      jest.spyOn(controller.drinkService, 'deleteDrink')
        .mockResolvedValue(true);

      await controller.deleteDrink(mockReq, mockRes);

      expect(controller.drinkService.deleteDrink).toHaveBeenCalledWith('testDrinkId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: expect.stringContaining('deleted successfully')
        })
      );
    });

    it('should return 403 when deleting unauthorized drink', async () => {
      mockReq.params.id = 'testDrinkId';
      const mockDrink = {
        _id: 'testDrinkId',
        userId: 'differentUserId'
      };

      jest.spyOn(controller.drinkService, 'getDrinkById')
        .mockResolvedValue(mockDrink);

      await controller.deleteDrink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: expect.stringContaining('own drink records')
        })
      );
    });
  });
});
