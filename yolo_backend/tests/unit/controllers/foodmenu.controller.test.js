const FoodMenuController = require('../../../src/controllers/foodmenu.controller');
const FoodMenuService = require('../../../src/services/foodmenu.service');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/foodmenu.service');

describe('FoodMenuController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new FoodMenuController();
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

  describe('createFoodMenu', () => {
    const validFoodMenuData = {
      name: '宫保鸡丁',
      category: '川菜',
      ingredients: ['鸡肉', '花生', '葱花'],
      spicyLevel: 2
    };

    it('should create food menu successfully', async () => {
      mockReq.body = validFoodMenuData;
      const expectedFoodMenu = { ...validFoodMenuData, _id: 'testFoodMenuId' };

      jest.spyOn(controller.foodMenuService, 'createFoodMenu')
        .mockResolvedValue(expectedFoodMenu);

      await controller.createFoodMenu(mockReq, mockRes);

      expect(controller.foodMenuService.createFoodMenu).toHaveBeenCalledWith(
        validFoodMenuData,
        'testUser'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedFoodMenu,
          msg: '菜品创建成功'
        })
      );
    });

    it('should handle creation error', async () => {
      mockReq.body = validFoodMenuData;
      const error = new Error('Creation failed');

      jest.spyOn(controller.foodMenuService, 'createFoodMenu')
        .mockRejectedValue(error);

      await controller.createFoodMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: error.message
        })
      );
    });
  });

  describe('getAllFoodMenus', () => {
    it('should get all food menus with query parameters', async () => {
      const mockQuery = {
        page: 1,
        limit: 10,
        category: '川菜'
      };
      mockReq.query = mockQuery;

      const mockResult = {
        items: [{ name: '宫保鸡丁' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      jest.spyOn(controller.foodMenuService, 'getFoodMenus')
        .mockResolvedValue(mockResult);

      await controller.getAllFoodMenus(mockReq, mockRes);

      expect(controller.foodMenuService.getFoodMenus).toHaveBeenCalledWith(mockQuery);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });
  });

  describe('getFoodMenuById', () => {
    it('should get food menu by id successfully', async () => {
      const foodMenuId = 'testFoodMenuId';
      mockReq.params.id = foodMenuId;
      const mockFoodMenu = {
        _id: foodMenuId,
        name: '宫保鸡丁'
      };

      jest.spyOn(controller.foodMenuService, 'getFoodMenuById')
        .mockResolvedValue(mockFoodMenu);

      await controller.getFoodMenuById(mockReq, mockRes);

      expect(controller.foodMenuService.getFoodMenuById).toHaveBeenCalledWith(foodMenuId);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockFoodMenu
        })
      );
    });

    it('should return 404 when food menu not found', async () => {
      mockReq.params.id = 'nonexistentId';
      jest.spyOn(controller.foodMenuService, 'getFoodMenuById')
        .mockResolvedValue(null);

      await controller.getFoodMenuById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: '菜品不存在'
        })
      );
    });
  });

  describe('updateFoodMenu', () => {
    const updateData = {
      spicyLevel: 3,
      ingredients: ['鸡肉', '花生', '葱花', '辣椒']
    };

    it('should update food menu successfully', async () => {
      mockReq.params.id = 'testFoodMenuId';
      mockReq.body = updateData;
      const updatedFoodMenu = {
        _id: 'testFoodMenuId',
        name: '宫保鸡丁',
        ...updateData
      };

      jest.spyOn(controller.foodMenuService, 'updateFoodMenu')
        .mockResolvedValue(updatedFoodMenu);

      await controller.updateFoodMenu(mockReq, mockRes);

      expect(controller.foodMenuService.updateFoodMenu).toHaveBeenCalledWith(
        'testFoodMenuId',
        updateData,
        'testUser'
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: updatedFoodMenu,
          msg: '菜品更新成功'
        })
      );
    });

    it('should return 404 when updating non-existent food menu', async () => {
      mockReq.params.id = 'nonexistentId';
      mockReq.body = updateData;

      jest.spyOn(controller.foodMenuService, 'updateFoodMenu')
        .mockResolvedValue(null);

      await controller.updateFoodMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: '菜品不存在'
        })
      );
    });
  });

  describe('deleteFoodMenu', () => {
    it('should delete food menu successfully', async () => {
      mockReq.params.id = 'testFoodMenuId';
      const deletedFoodMenu = {
        _id: 'testFoodMenuId',
        name: '宫保鸡丁'
      };

      jest.spyOn(controller.foodMenuService, 'deleteFoodMenu')
        .mockResolvedValue(deletedFoodMenu);

      await controller.deleteFoodMenu(mockReq, mockRes);

      expect(controller.foodMenuService.deleteFoodMenu).toHaveBeenCalledWith('testFoodMenuId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: '菜品删除成功'
        })
      );
    });

    it('should return 404 when deleting non-existent food menu', async () => {
      mockReq.params.id = 'nonexistentId';
      jest.spyOn(controller.foodMenuService, 'deleteFoodMenu')
        .mockResolvedValue(null);

      await controller.deleteFoodMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: '菜品不存在'
        })
      );
    });
  });

  describe('getRandomFoodMenus', () => {
    it('should get random food menus with default count', async () => {
      const mockFoodMenus = [{ name: '宫保鸡丁' }];

      jest.spyOn(controller.foodMenuService, 'getRandomFoodMenus')
        .mockResolvedValue(mockFoodMenus);

      await controller.getRandomFoodMenus(mockReq, mockRes);

      expect(controller.foodMenuService.getRandomFoodMenus).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: { result: mockFoodMenus },
          msg: '今晚吃这些！'
        })
      );
    });

    it('should respect foodCount parameter within limits', async () => {
      mockReq.query.foodCount = '5';
      const mockFoodMenus = Array(5).fill({ name: '宫保鸡丁' });

      jest.spyOn(controller.foodMenuService, 'getRandomFoodMenus')
        .mockResolvedValue(mockFoodMenus);

      await controller.getRandomFoodMenus(mockReq, mockRes);

      expect(controller.foodMenuService.getRandomFoodMenus).toHaveBeenCalledWith(5);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: { result: mockFoodMenus }
        })
      );
    });

    it('should limit foodCount to maximum of 10', async () => {
      mockReq.query.foodCount = '15';
      const mockFoodMenus = Array(10).fill({ name: '宫保鸡丁' });

      jest.spyOn(controller.foodMenuService, 'getRandomFoodMenus')
        .mockResolvedValue(mockFoodMenus);

      await controller.getRandomFoodMenus(mockReq, mockRes);

      expect(controller.foodMenuService.getRandomFoodMenus).toHaveBeenCalledWith(10);
    });
  });
});
