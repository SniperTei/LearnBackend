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
    it('should create a food menu', async () => {
      const mockFoodMenuData = {
        name: 'Test Food',
        price: 10.99
      };
      const mockCreatedFoodMenu = { ...mockFoodMenuData, _id: '123' };

      const mockSave = jest.fn().mockResolvedValue(mockCreatedFoodMenu);
      FoodMenu.mockImplementation(() => ({
        save: mockSave
      }));

      const result = await foodMenuDAL.create(mockFoodMenuData);

      expect(FoodMenu).toHaveBeenCalledWith(mockFoodMenuData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedFoodMenu);
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
      const mockLean = jest.fn().mockResolvedValue(mockFoodMenus);
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

      FoodMenu.find = mockFind;
      FoodMenu.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      const result = await foodMenuDAL.find(mockFilter, mockOptions);

      expect(mockFind).toHaveBeenCalledWith(mockFilter);
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockLean).toHaveBeenCalled();
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
      const mockId = '123';
      const mockFoodMenu = {
        _id: mockId,
        name: 'Test Food',
        price: 10.99
      };

      const mockLean = jest.fn().mockResolvedValue(mockFoodMenu);
      FoodMenu.findById = jest.fn().mockReturnValue({ lean: mockLean });

      const result = await foodMenuDAL.findById(mockId);

      expect(FoodMenu.findById).toHaveBeenCalledWith(mockId);
      expect(mockLean).toHaveBeenCalled();
      expect(result).toEqual(mockFoodMenu);
    });

    it('should return null when food menu not found', async () => {
      const mockId = '123';

      const mockLean = jest.fn().mockResolvedValue(null);
      FoodMenu.findById = jest.fn().mockReturnValue({ lean: mockLean });

      const result = await foodMenuDAL.findById(mockId);

      expect(FoodMenu.findById).toHaveBeenCalledWith(mockId);
      expect(mockLean).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update food menu', async () => {
      const mockId = '123';
      const mockUpdateData = {
        name: 'Updated Food',
        price: 15.99
      };
      const mockUpdatedFoodMenu = {
        _id: mockId,
        ...mockUpdateData
      };

      const mockLean = jest.fn().mockResolvedValue(mockUpdatedFoodMenu);
      FoodMenu.findByIdAndUpdate = jest.fn().mockReturnValue({ lean: mockLean });

      const result = await foodMenuDAL.update(mockId, mockUpdateData);

      expect(FoodMenu.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockUpdateData,
        { new: true, runValidators: true }
      );
      expect(mockLean).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedFoodMenu);
    });
  });

  describe('delete', () => {
    it('should delete food menu', async () => {
      const mockId = '123';
      const mockDeletedFoodMenu = {
        _id: mockId,
        name: 'Deleted Food',
        price: 10.99
      };

      const mockLean = jest.fn().mockResolvedValue(mockDeletedFoodMenu);
      FoodMenu.findByIdAndDelete = jest.fn().mockReturnValue({ lean: mockLean });

      const result = await foodMenuDAL.delete(mockId);

      expect(FoodMenu.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(mockLean).toHaveBeenCalled();
      expect(result).toEqual(mockDeletedFoodMenu);
    });
  });

  describe('getRandom', () => {
    it('should return random food menus', async () => {
      const mockCount = 2;
      const mockRandomFoodMenus = [
        { _id: '1', name: 'Random Food 1', price: 10.99 },
        { _id: '2', name: 'Random Food 2', price: 12.99 }
      ];

      FoodMenu.aggregate = jest.fn().mockResolvedValue(mockRandomFoodMenus);

      const result = await foodMenuDAL.getRandom(mockCount);

      expect(FoodMenu.aggregate).toHaveBeenCalledWith([
        { $sample: { size: mockCount } }
      ]);
      expect(result).toEqual(mockRandomFoodMenus);
    });
  });
});
