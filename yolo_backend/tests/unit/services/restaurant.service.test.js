const RestaurantService = require('../../../src/services/restaurant.service');
const RestaurantDAL = require('../../../src/dal/restaurant.dal');

jest.mock('../../../src/dal/restaurant.dal');

describe('RestaurantService', () => {
  let restaurantService;
  let mockRestaurantDAL;

  beforeEach(() => {
    mockRestaurantDAL = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    RestaurantDAL.mockImplementation(() => mockRestaurantDAL);
    restaurantService = new RestaurantService();
  });

  describe('createRestaurant', () => {
    it('should create a restaurant and return formatted data', async () => {
      const mockRestaurantData = {
        name: 'Test Restaurant',
        address: 'Test Address',
        phone: '123456789'
      };
      const mockUsername = 'testuser';
      const mockCreatedRestaurant = {
        _id: '123',
        ...mockRestaurantData,
        createdBy: mockUsername,
        updatedBy: mockUsername
      };

      mockRestaurantDAL.create.mockResolvedValue(mockCreatedRestaurant);

      const result = await restaurantService.createRestaurant(mockRestaurantData, mockUsername);

      expect(mockRestaurantDAL.create).toHaveBeenCalledWith({
        ...mockRestaurantData,
        createdBy: mockUsername,
        updatedBy: mockUsername
      });
      expect(result).toEqual({
        restaurantId: mockCreatedRestaurant._id,
        ...mockRestaurantData,
        createdBy: mockUsername,
        updatedBy: mockUsername
      });
    });
  });

  describe('getAllRestaurants', () => {
    it('should return formatted restaurants list with pagination', async () => {
      const mockQuery = {
        page: '1',
        limit: '10',
        name: 'Test',
        sortBy: 'createdAt',
        order: 'desc'
      };

      const mockRestaurants = [
        {
          _id: '123',
          name: 'Test Restaurant 1',
          address: 'Address 1',
          createdBy: 'user1'
        },
        {
          _id: '456',
          name: 'Test Restaurant 2',
          address: 'Address 2',
          createdBy: 'user2'
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

      mockRestaurantDAL.find.mockResolvedValue({
        restaurants: mockRestaurants,
        pagination: mockPagination
      });

      const result = await restaurantService.getAllRestaurants(mockQuery);

      const expectedFilter = {
        name: { $regex: 'Test', $options: 'i' }
      };
      const expectedOptions = {
        skip: 0,
        limit: 10,
        sort: { createdAt: -1 }
      };

      expect(mockRestaurantDAL.find).toHaveBeenCalledWith(expectedFilter, expectedOptions);
      expect(result).toEqual({
        restaurants: mockRestaurants.map(restaurant => ({
          restaurantId: restaurant._id,
          name: restaurant.name,
          address: restaurant.address,
          createdBy: restaurant.createdBy
        })),
        pagination: mockPagination
      });
    });

    it('should handle rating range filter', async () => {
      const mockQuery = {
        minRating: '4',
        maxRating: '5',
        page: '1',
        limit: '10'
      };

      const mockRestaurants = [
        {
          _id: '123',
          name: 'High Rated Restaurant',
          rating: 4.5,
          createdBy: 'user1'
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

      mockRestaurantDAL.find.mockResolvedValue({
        restaurants: mockRestaurants,
        pagination: mockPagination
      });

      const result = await restaurantService.getAllRestaurants(mockQuery);

      const expectedFilter = {
        rating: {
          $gte: 4,
          $lte: 5
        }
      };
      const expectedOptions = {
        skip: 0,
        limit: 10,
        sort: { createdAt: -1 }
      };

      expect(mockRestaurantDAL.find).toHaveBeenCalledWith(expectedFilter, expectedOptions);
      expect(result).toEqual({
        restaurants: mockRestaurants.map(restaurant => ({
          restaurantId: restaurant._id,
          name: restaurant.name,
          rating: restaurant.rating,
          createdBy: restaurant.createdBy
        })),
        pagination: mockPagination
      });
    });
  });

  describe('getRestaurantById', () => {
    it('should return formatted restaurant by id', async () => {
      const mockId = '123';
      const mockRestaurant = {
        _id: mockId,
        name: 'Test Restaurant',
        address: 'Test Address',
        createdBy: 'testuser'
      };

      mockRestaurantDAL.findById.mockResolvedValue(mockRestaurant);

      const result = await restaurantService.getRestaurantById(mockId);

      expect(mockRestaurantDAL.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        restaurantId: mockRestaurant._id,
        name: mockRestaurant.name,
        address: mockRestaurant.address,
        createdBy: mockRestaurant.createdBy
      });
    });
  });

  describe('updateRestaurant', () => {
    it('should update restaurant and return formatted data', async () => {
      const mockId = '123';
      const mockUpdateData = {
        name: 'Updated Restaurant',
        address: 'Updated Address'
      };
      const mockUsername = 'testuser';
      const mockUpdatedRestaurant = {
        _id: mockId,
        ...mockUpdateData,
        updatedBy: mockUsername
      };

      mockRestaurantDAL.update.mockResolvedValue(mockUpdatedRestaurant);

      const result = await restaurantService.updateRestaurant(mockId, mockUpdateData, mockUsername);

      expect(mockRestaurantDAL.update).toHaveBeenCalledWith(mockId, {
        ...mockUpdateData,
        updatedBy: mockUsername
      });
      expect(result).toEqual({
        restaurantId: mockUpdatedRestaurant._id,
        ...mockUpdateData,
        updatedBy: mockUsername
      });
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant and return formatted data', async () => {
      const mockId = '123';
      const mockDeletedRestaurant = {
        _id: mockId,
        name: 'Deleted Restaurant',
        address: 'Deleted Address',
        createdBy: 'testuser'
      };

      mockRestaurantDAL.delete.mockResolvedValue(mockDeletedRestaurant);

      const result = await restaurantService.deleteRestaurant(mockId);

      expect(mockRestaurantDAL.delete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        restaurantId: mockDeletedRestaurant._id,
        name: mockDeletedRestaurant.name,
        address: mockDeletedRestaurant.address,
        createdBy: mockDeletedRestaurant.createdBy
      });
    });
  });
});
