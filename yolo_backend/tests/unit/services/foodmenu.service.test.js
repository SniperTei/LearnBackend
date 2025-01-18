const FoodMenuService = require('../../../src/services/foodmenu.service');
const FoodMenuDAL = require('../../../src/dal/foodmenu.dal');

// Mock the FoodMenuDAL
jest.mock('../../../src/dal/foodmenu.dal');

describe('FoodMenuService', () => {
  let foodMenuService;
  let mockFoodMenuDAL;

  beforeEach(() => {
    jest.clearAllMocks();
    foodMenuService = new FoodMenuService();
    mockFoodMenuDAL = FoodMenuDAL.mock.instances[0];
  });

  describe('createFoodMenu', () => {
    it('should create food menu and return formatted data', async () => {
      const mockFoodMenuData = {
        name: 'Test Food',
        price: 10.99,
        description: 'Test Description',
        category: 'main',
        spicyLevel: 1,
        isVegetarian: false,
        imageUrl: 'test.jpg'
      };

      const mockCreatedFoodMenu = {
        _id: '123',
        ...mockFoodMenuData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFoodMenuDAL.create = jest.fn().mockResolvedValue(mockCreatedFoodMenu);

      const result = await foodMenuService.createFoodMenu(mockFoodMenuData);

      expect(mockFoodMenuDAL.create).toHaveBeenCalledWith(mockFoodMenuData);
      expect(result).toEqual({
        foodMenuId: '123',
        ...mockFoodMenuData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('getFoodMenus', () => {
    it('should return formatted food menus list with pagination', async () => {
      const mockQuery = {
        type: 'main',
        page: '1',
        limit: '10',
        sortBy: 'createdAt',
        order: 'desc'
      };
      const mockFoodMenus = [
        {
          _id: '123',
          name: 'Test Food 1',
          price: 10.99,
          type: 'main'
        },
        {
          _id: '456',
          name: 'Test Food 2',
          price: 12.99,
          type: 'main'
        }
      ];
      const mockPagination = {
        total: 2,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };

      mockFoodMenuDAL.find = jest.fn().mockResolvedValue({
        foodMenus: mockFoodMenus,
        pagination: mockPagination
      });

      const result = await foodMenuService.getFoodMenus(mockQuery);

      const expectedFilter = { type: 'main' };
      const expectedOptions = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      };

      expect(mockFoodMenuDAL.find).toHaveBeenCalledWith(expectedFilter, expectedOptions);
      expect(result).toEqual({
        foodMenus: mockFoodMenus.map(menu => ({
          foodMenuId: menu._id,
          name: menu.name,
          price: menu.price,
          type: menu.type
        })),
        pagination: mockPagination
      });
    });

    it('should handle price range filter', async () => {
      const mockQuery = {
        minPrice: '10',
        maxPrice: '20',
        page: '1',
        limit: '10'
      };

      const mockFoodMenus = [
        {
          _id: '123',
          name: 'Test Food 1',
          price: 15.99,
          type: 'main'
        }
      ];
      const mockPagination = {
        total: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };

      mockFoodMenuDAL.find = jest.fn().mockResolvedValue({
        foodMenus: mockFoodMenus,
        pagination: mockPagination
      });

      const result = await foodMenuService.getFoodMenus(mockQuery);

      const expectedFilter = {
        price: {
          $gte: '10',
          $lte: '20'
        }
      };
      const expectedOptions = {
        page: 1,
        limit: 10,
        sortBy: undefined,
        order: undefined
      };

      expect(mockFoodMenuDAL.find).toHaveBeenCalledWith(expectedFilter, expectedOptions);
      expect(result).toEqual({
        foodMenus: mockFoodMenus.map(menu => ({
          foodMenuId: menu._id,
          name: menu.name,
          price: menu.price,
          type: menu.type
        })),
        pagination: mockPagination
      });
    });
  });

  describe('getFoodMenuById', () => {
    it('should return formatted food menu by id', async () => {
      const mockId = '123';
      const mockFoodMenu = {
        _id: mockId,
        name: 'Test Food',
        price: 10.99,
        category: 'main'
      };

      mockFoodMenuDAL.findById = jest.fn().mockResolvedValue(mockFoodMenu);

      const result = await foodMenuService.getFoodMenuById(mockId);

      expect(mockFoodMenuDAL.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        foodMenuId: mockId,
        name: mockFoodMenu.name,
        price: mockFoodMenu.price,
        category: mockFoodMenu.category
      });
    });

    it('should return null when food menu not found', async () => {
      const mockId = '123';
      mockFoodMenuDAL.findById = jest.fn().mockResolvedValue(null);

      const result = await foodMenuService.getFoodMenuById(mockId);

      expect(mockFoodMenuDAL.findById).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });
  });

  describe('updateFoodMenu', () => {
    it('should update and return formatted food menu', async () => {
      const mockId = '123';
      const mockUpdateData = {
        name: 'Updated Food',
        price: 15.99
      };
      const mockUpdatedFoodMenu = {
        _id: mockId,
        name: 'Updated Food',
        price: 15.99,
        category: 'main'
      };

      mockFoodMenuDAL.update = jest.fn().mockResolvedValue(mockUpdatedFoodMenu);

      const result = await foodMenuService.updateFoodMenu(mockId, mockUpdateData);

      expect(mockFoodMenuDAL.update).toHaveBeenCalledWith(mockId, mockUpdateData);
      expect(result).toEqual({
        foodMenuId: mockId,
        name: mockUpdatedFoodMenu.name,
        price: mockUpdatedFoodMenu.price,
        category: mockUpdatedFoodMenu.category
      });
    });
  });

  describe('deleteFoodMenu', () => {
    it('should delete and return formatted food menu', async () => {
      const mockId = '123';
      const mockDeletedFoodMenu = {
        _id: mockId,
        name: 'Deleted Food',
        price: 10.99,
        category: 'main'
      };

      mockFoodMenuDAL.delete = jest.fn().mockResolvedValue(mockDeletedFoodMenu);

      const result = await foodMenuService.deleteFoodMenu(mockId);

      expect(mockFoodMenuDAL.delete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        foodMenuId: mockId,
        name: mockDeletedFoodMenu.name,
        price: mockDeletedFoodMenu.price,
        category: mockDeletedFoodMenu.category
      });
    });
  });

  describe('getRandomFoodMenus', () => {
    it('should return formatted random food menus', async () => {
      const mockCount = 2;
      const mockFoodMenus = [
        {
          _id: '123',
          name: 'Food 1',
          price: 10.99,
          category: 'main'
        },
        {
          _id: '456',
          name: 'Food 2',
          price: 12.99,
          category: 'main'
        }
      ];

      mockFoodMenuDAL.getRandom = jest.fn().mockResolvedValue(mockFoodMenus);

      const result = await foodMenuService.getRandomFoodMenus(mockCount);

      expect(mockFoodMenuDAL.getRandom).toHaveBeenCalledWith(mockCount);
      expect(result).toEqual(mockFoodMenus.map(menu => ({
        foodMenuId: menu._id,
        name: menu.name,
        price: menu.price,
        category: menu.category
      })));
    });
  });
});
