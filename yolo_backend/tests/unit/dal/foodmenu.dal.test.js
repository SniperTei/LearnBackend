const mongoose = require('mongoose');
const FoodMenuDAL = require('../../../src/dal/foodmenu.dal');
const FoodMenu = require('../../../src/models/foodmenu.model');

// Mock Mongoose and FoodMenu model
jest.mock('../../../src/models/foodmenu.model');

describe('FoodMenuDAL', () => {
  let foodMenuDAL;

  beforeEach(() => {
    jest.clearAllMocks();
    foodMenuDAL = new FoodMenuDAL();
  });

  describe('create', () => {
    it('should create a new food menu', async () => {
      const mockFoodMenuData = {
        name: 'Test Food',
        price: 10.99,
        description: 'Test Description',
        category: 'main',
        spicyLevel: 1,
        isVegetarian: false,
        imageUrl: 'test.jpg'
      };

      const mockSavedFoodMenu = {
        _id: new mongoose.Types.ObjectId(),
        ...mockFoodMenuData,
        save: jest.fn().mockResolvedValue(mockFoodMenuData)
      };

      FoodMenu.mockImplementation(() => mockSavedFoodMenu);

      const result = await foodMenuDAL.create(mockFoodMenuData);

      expect(FoodMenu).toHaveBeenCalledWith(mockFoodMenuData);
      expect(mockSavedFoodMenu.save).toHaveBeenCalled();
      expect(result).toEqual(mockFoodMenuData);
    });
  });

  describe('find', () => {
    it('should return food menus with pagination', async () => {
      const mockFilter = { type: 'main' };
      const mockOptions = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      };
      const mockFoodMenus = [
        { _id: '1', name: 'Food 1', price: 10.99 },
        { _id: '2', name: 'Food 2', price: 12.99 }
      ];
      const mockTotal = 2;

      // Mock the find operation with query chain
      const findQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFoodMenus)
      };

      FoodMenu.find = jest.fn().mockReturnValue(findQuery);
      FoodMenu.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      const result = await foodMenuDAL.find(mockFilter, mockOptions);

      expect(FoodMenu.find).toHaveBeenCalledWith(mockFilter);
      expect(findQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(findQuery.skip).toHaveBeenCalledWith(0);
      expect(findQuery.limit).toHaveBeenCalledWith(10);
      expect(FoodMenu.countDocuments).toHaveBeenCalledWith(mockFilter);

      expect(result).toEqual({
        foodMenus: mockFoodMenus,
        pagination: {
          total: mockTotal,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });
  });

  describe('findById', () => {
    it('should return food menu by id', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockFoodMenu = {
        _id: mockId,
        name: 'Test Food',
        price: 10.99
      };

      FoodMenu.findById = jest.fn().mockResolvedValue(mockFoodMenu);

      const result = await foodMenuDAL.findById(mockId);

      expect(FoodMenu.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockFoodMenu);
    });

    it('should return null when food menu not found', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();

      FoodMenu.findById = jest.fn().mockResolvedValue(null);

      const result = await foodMenuDAL.findById(mockId);

      expect(FoodMenu.findById).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update food menu', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockUpdateData = { name: 'Updated Food', price: 15.99 };
      const mockUpdatedFoodMenu = {
        _id: mockId,
        ...mockUpdateData
      };

      FoodMenu.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedFoodMenu);

      const result = await foodMenuDAL.update(mockId, mockUpdateData);

      expect(FoodMenu.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockUpdateData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedFoodMenu);
    });
  });

  describe('delete', () => {
    it('should delete food menu', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockDeletedFoodMenu = {
        _id: mockId,
        name: 'Deleted Food',
        price: 10.99
      };

      FoodMenu.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedFoodMenu);

      const result = await foodMenuDAL.delete(mockId);

      expect(FoodMenu.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockDeletedFoodMenu);
    });
  });

  describe('getRandom', () => {
    it('should return random food menus', async () => {
      const mockCount = 2;
      const mockFoodMenus = [
        { _id: '1', name: 'Food 1', price: 10.99 },
        { _id: '2', name: 'Food 2', price: 12.99 }
      ];

      FoodMenu.aggregate = jest.fn().mockResolvedValue(mockFoodMenus);

      const result = await foodMenuDAL.getRandom(mockCount);

      expect(FoodMenu.aggregate).toHaveBeenCalledWith([
        { $sample: { size: mockCount } }
      ]);
      expect(result).toEqual(mockFoodMenus);
    });
  });
});
