const RestaurantController = require('../../../src/controllers/restaurant.controller');
const RestaurantService = require('../../../src/services/restaurant.service');
const UserService = require('../../../src/services/user.service');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/restaurant.service');
jest.mock('../../../src/services/user.service');

describe('RestaurantController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new RestaurantController();
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

  describe('createRestaurant', () => {
    const validRestaurantData = {
      name: '测试餐厅',
      address: '测试地址',
      cuisine: '中餐',
      rating: 4.5
    };

    it('should create restaurant when user is admin', async () => {
      mockReq.body = validRestaurantData;
      const mockUser = { _id: 'testUserId', isAdmin: true };
      const expectedRestaurant = { ...validRestaurantData, _id: 'testRestaurantId' };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);
      jest.spyOn(controller.restaurantService, 'createRestaurant')
        .mockResolvedValue(expectedRestaurant);

      await controller.createRestaurant(mockReq, mockRes);

      expect(controller.userService.getUserById).toHaveBeenCalledWith('testUserId');
      expect(controller.restaurantService.createRestaurant).toHaveBeenCalledWith(
        validRestaurantData,
        'testUser'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedRestaurant,
          msg: '餐厅创建成功'
        })
      );
    });

    it('should return 403 when user is not admin', async () => {
      mockReq.body = validRestaurantData;
      const mockUser = { _id: 'testUserId', isAdmin: false };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);

      await controller.createRestaurant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: '只有管理员才能创建餐厅'
        })
      );
    });
  });

  describe('getAllRestaurants', () => {
    it('should get all restaurants with query parameters', async () => {
      const mockQuery = {
        page: 1,
        limit: 10,
        cuisine: '中餐'
      };
      mockReq.query = mockQuery;

      const mockResult = {
        restaurants: [{ name: '测试餐厅' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      jest.spyOn(controller.restaurantService, 'getAllRestaurants')
        .mockResolvedValue(mockResult);

      await controller.getAllRestaurants(mockReq, mockRes);

      expect(controller.restaurantService.getAllRestaurants).toHaveBeenCalledWith(mockQuery);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });
  });

  describe('getRestaurantById', () => {
    it('should get restaurant by id successfully', async () => {
      const restaurantId = 'testRestaurantId';
      mockReq.params.id = restaurantId;
      const mockRestaurant = {
        _id: restaurantId,
        name: '测试餐厅'
      };

      jest.spyOn(controller.restaurantService, 'getRestaurantById')
        .mockResolvedValue(mockRestaurant);

      await controller.getRestaurantById(mockReq, mockRes);

      expect(controller.restaurantService.getRestaurantById).toHaveBeenCalledWith(restaurantId);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockRestaurant
        })
      );
    });

    it('should return 404 when restaurant not found', async () => {
      mockReq.params.id = 'nonexistentId';
      jest.spyOn(controller.restaurantService, 'getRestaurantById')
        .mockResolvedValue(null);

      await controller.getRestaurantById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00404',
          msg: '餐厅不存在'
        })
      );
    });
  });

  describe('updateRestaurant', () => {
    const updateData = {
      name: '更新的餐厅',
      rating: 4.8
    };

    it('should update restaurant when user is admin', async () => {
      mockReq.params.id = 'testRestaurantId';
      mockReq.body = updateData;
      const mockUser = { _id: 'testUserId', isAdmin: true };
      const updatedRestaurant = {
        _id: 'testRestaurantId',
        ...updateData
      };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);
      jest.spyOn(controller.restaurantService, 'updateRestaurant')
        .mockResolvedValue(updatedRestaurant);

      await controller.updateRestaurant(mockReq, mockRes);

      expect(controller.userService.getUserById).toHaveBeenCalledWith('testUserId');
      expect(controller.restaurantService.updateRestaurant).toHaveBeenCalledWith(
        'testRestaurantId',
        updateData,
        'testUser'
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: updatedRestaurant,
          msg: '餐厅更新成功'
        })
      );
    });

    it('should return 403 when user is not admin', async () => {
      mockReq.params.id = 'testRestaurantId';
      mockReq.body = updateData;
      const mockUser = { _id: 'testUserId', isAdmin: false };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);

      await controller.updateRestaurant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: '只有管理员才能更新餐厅'
        })
      );
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant when user is admin', async () => {
      mockReq.params.id = 'testRestaurantId';
      const mockUser = { _id: 'testUserId', isAdmin: true };
      const deletedRestaurant = {
        _id: 'testRestaurantId',
        name: '测试餐厅'
      };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);
      jest.spyOn(controller.restaurantService, 'deleteRestaurant')
        .mockResolvedValue(deletedRestaurant);

      await controller.deleteRestaurant(mockReq, mockRes);

      expect(controller.userService.getUserById).toHaveBeenCalledWith('testUserId');
      expect(controller.restaurantService.deleteRestaurant).toHaveBeenCalledWith('testRestaurantId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: '餐厅删除成功'
        })
      );
    });

    it('should return 403 when user is not admin', async () => {
      mockReq.params.id = 'testRestaurantId';
      const mockUser = { _id: 'testUserId', isAdmin: false };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);

      await controller.deleteRestaurant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00403',
          msg: '只有管理员才能删除餐厅'
        })
      );
    });

    it('should return 404 when restaurant not found', async () => {
      mockReq.params.id = 'nonexistentId';
      const mockUser = { _id: 'testUserId', isAdmin: true };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);
      jest.spyOn(controller.restaurantService, 'deleteRestaurant')
        .mockResolvedValue(null);

      await controller.deleteRestaurant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'A00404',
          msg: '餐厅不存在'
        })
      );
    });
  });
});
