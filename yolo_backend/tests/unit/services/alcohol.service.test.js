const AlcoholService = require('../../../src/services/alcohol.service');
const AlcoholDAO = require('../../../src/dal/alcohol.dal');

// Mock the AlcoholDAO
jest.mock('../../../src/dal/alcohol.dal');

describe('AlcoholService', () => {
  let alcoholService;
  let mockAlcoholDAO;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of AlcoholService for each test
    alcoholService = new AlcoholService();
    mockAlcoholDAO = AlcoholDAO.mock.instances[0];
  });

  describe('createAlcohol', () => {
    it('should create alcohol and return formatted data', async () => {
      const mockAlcoholData = {
        name: 'Test Alcohol',
        type: 'beer',
        brand: 'Test Brand',
        alcoholContent: 5.0,
        volume: 330,
        volumeUnit: 'ml'
      };

      const mockCreatedAlcohol = {
        _id: '123',
        ...mockAlcoholData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockAlcoholDAO.createAlcohol = jest.fn().mockResolvedValue(mockCreatedAlcohol);

      const result = await alcoholService.createAlcohol(mockAlcoholData);

      expect(mockAlcoholDAO.createAlcohol).toHaveBeenCalledWith(mockAlcoholData);
      expect(result).toEqual({
        alcoholId: '123',
        ...mockAlcoholData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('getAllAlcohols', () => {
    it('should return formatted alcohols list with pagination', async () => {
      const mockFilter = { type: 'beer' };
      const mockOptions = { page: 1, limit: 10 };
      const mockAlcohols = [
        {
          _id: '123',
          name: 'Test Alcohol 1',
          type: 'beer'
        },
        {
          _id: '456',
          name: 'Test Alcohol 2',
          type: 'beer'
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

      mockAlcoholDAO.getAllAlcohols = jest.fn().mockResolvedValue({
        alcohols: mockAlcohols,
        pagination: mockPagination
      });

      const result = await alcoholService.getAllAlcohols(mockFilter, mockOptions);

      expect(mockAlcoholDAO.getAllAlcohols).toHaveBeenCalledWith(mockFilter, mockOptions);
      expect(result).toEqual({
        alcohols: mockAlcohols.map(alcohol => ({
          alcoholId: alcohol._id,
          name: alcohol.name,
          type: alcohol.type
        })),
        pagination: mockPagination
      });
    });
  });

  describe('getAlcoholById', () => {
    it('should return formatted alcohol by id', async () => {
      const mockId = '123';
      const mockAlcohol = {
        _id: mockId,
        name: 'Test Alcohol',
        type: 'beer'
      };

      mockAlcoholDAO.getAlcoholById = jest.fn().mockResolvedValue(mockAlcohol);

      const result = await alcoholService.getAlcoholById(mockId);

      expect(mockAlcoholDAO.getAlcoholById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        alcoholId: mockId,
        name: mockAlcohol.name,
        type: mockAlcohol.type
      });
    });

    it('should return null when alcohol not found', async () => {
      const mockId = '123';
      mockAlcoholDAO.getAlcoholById = jest.fn().mockResolvedValue(null);

      const result = await alcoholService.getAlcoholById(mockId);

      expect(mockAlcoholDAO.getAlcoholById).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });
  });

  describe('updateAlcohol', () => {
    it('should update and return formatted alcohol', async () => {
      const mockId = '123';
      const mockUpdateData = {
        name: 'Updated Alcohol'
      };
      const mockUpdatedAlcohol = {
        _id: mockId,
        name: 'Updated Alcohol',
        type: 'beer'
      };

      mockAlcoholDAO.updateAlcohol = jest.fn().mockResolvedValue(mockUpdatedAlcohol);

      const result = await alcoholService.updateAlcohol(mockId, mockUpdateData);

      expect(mockAlcoholDAO.updateAlcohol).toHaveBeenCalledWith(mockId, mockUpdateData);
      expect(result).toEqual({
        alcoholId: mockId,
        name: mockUpdatedAlcohol.name,
        type: mockUpdatedAlcohol.type
      });
    });
  });

  describe('deleteAlcohol', () => {
    it('should delete and return formatted alcohol', async () => {
      const mockId = '123';
      const mockDeletedAlcohol = {
        _id: mockId,
        name: 'Deleted Alcohol',
        type: 'beer'
      };

      mockAlcoholDAO.deleteAlcohol = jest.fn().mockResolvedValue(mockDeletedAlcohol);

      const result = await alcoholService.deleteAlcohol(mockId);

      expect(mockAlcoholDAO.deleteAlcohol).toHaveBeenCalledWith(mockId);
      expect(result).toEqual({
        alcoholId: mockId,
        name: mockDeletedAlcohol.name,
        type: mockDeletedAlcohol.type
      });
    });
  });
});
