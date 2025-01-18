const { Restaurant } = require('../../../src/models/restaurant.model');
const RestaurantDAL = require('../../../src/dal/restaurant.dal');

jest.mock('../../../src/models/restaurant.model');

describe('RestaurantDAL', () => {
  let restaurantDAL;

  beforeEach(() => {
    jest.clearAllMocks();
    restaurantDAL = new RestaurantDAL();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const mockRestaurantData = {
        name: 'Test Restaurant',
        address: 'Test Address',
        phone: '123456789'
      };
      const mockCreatedRestaurant = { ...mockRestaurantData, _id: '123' };

      Restaurant.create = jest.fn().mockResolvedValue(mockCreatedRestaurant);

      const result = await restaurantDAL.create(mockRestaurantData);

      expect(Restaurant.create).toHaveBeenCalledWith(mockRestaurantData);
      expect(result).toEqual(mockCreatedRestaurant);
    });
  });

  describe('find', () => {
    it('should return restaurants with pagination', async () => {
      const mockFilter = { type: 'main' };
      const mockOptions = {
        skip: 0,
        limit: 10,
        sort: { createdAt: -1 }
      };
      const mockRestaurants = [
        { _id: '1', name: 'Restaurant 1', address: 'Address 1' },
        { _id: '2', name: 'Restaurant 2', address: 'Address 2' }
      ];
      const mockTotal = 2;

      // Mock the find operation with query chain
      const findQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRestaurants)
      };

      Restaurant.find = jest.fn().mockReturnValue(findQuery);
      Restaurant.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      const result = await restaurantDAL.find(mockFilter, mockOptions);

      expect(Restaurant.find).toHaveBeenCalledWith(mockFilter);
      expect(findQuery.sort).toHaveBeenCalledWith(mockOptions.sort);
      expect(findQuery.skip).toHaveBeenCalledWith(mockOptions.skip);
      expect(findQuery.limit).toHaveBeenCalledWith(mockOptions.limit);
      expect(Restaurant.countDocuments).toHaveBeenCalledWith(mockFilter);

      expect(result).toEqual({
        restaurants: mockRestaurants,
        total: mockTotal,
        page: 1,
        totalPages: 1
      });
    });
  });

  describe('findById', () => {
    it('should find a restaurant by id', async () => {
      const mockId = '123';
      const mockRestaurant = {
        _id: mockId,
        name: 'Test Restaurant',
        address: 'Test Address'
      };

      Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);

      const result = await restaurantDAL.findById(mockId);

      expect(Restaurant.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const mockId = '123';
      const mockUpdateData = {
        name: 'Updated Restaurant',
        address: 'Updated Address'
      };
      const mockUpdatedRestaurant = {
        _id: mockId,
        ...mockUpdateData
      };

      Restaurant.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedRestaurant);

      const result = await restaurantDAL.update(mockId, mockUpdateData);

      expect(Restaurant.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockUpdateData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedRestaurant);
    });
  });

  describe('delete', () => {
    it('should delete a restaurant', async () => {
      const mockId = '123';
      const mockDeletedRestaurant = {
        _id: mockId,
        name: 'Deleted Restaurant',
        address: 'Deleted Address'
      };

      Restaurant.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedRestaurant);

      const result = await restaurantDAL.delete(mockId);

      expect(Restaurant.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockDeletedRestaurant);
    });
  });
});
