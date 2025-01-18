const mongoose = require('mongoose');
const AlcoholDAO = require('../../../src/dal/alcohol.dal');
const Alcohol = require('../../../src/models/alcohol.model');

// Mock Mongoose and Alcohol model
jest.mock('../../../src/models/alcohol.model');

describe('AlcoholDAO', () => {
  let alcoholDAO;

  beforeEach(() => {
    jest.clearAllMocks();
    alcoholDAO = new AlcoholDAO();
  });

  describe('createAlcohol', () => {
    it('should create a new alcohol', async () => {
      const mockAlcoholData = {
        name: 'Test Alcohol',
        type: 'beer',
        brand: 'Test Brand',
        alcoholContent: 5.0
      };

      const mockSavedAlcohol = {
        _id: new mongoose.Types.ObjectId(),
        ...mockAlcoholData,
        save: jest.fn().mockResolvedValue(mockAlcoholData)
      };

      Alcohol.mockImplementation(() => mockSavedAlcohol);

      const result = await alcoholDAO.createAlcohol(mockAlcoholData);

      expect(Alcohol).toHaveBeenCalledWith(mockAlcoholData);
      expect(mockSavedAlcohol.save).toHaveBeenCalled();
      expect(result).toEqual(mockAlcoholData);
    });
  });

  describe('getAllAlcohols', () => {
    it('should return alcohols with pagination', async () => {
      const mockFilter = { type: 'beer' };
      const mockOptions = { page: 1, limit: 10, sort: {} };
      const mockAlcohols = [
        { _id: '1', name: 'Alcohol 1' },
        { _id: '2', name: 'Alcohol 2' }
      ];
      const mockTotal = 2;

      Alcohol.find = jest.fn().mockReturnThis();
      Alcohol.sort = jest.fn().mockReturnThis();
      Alcohol.skip = jest.fn().mockReturnThis();
      Alcohol.limit = jest.fn().mockReturnThis();
      Alcohol.lean = jest.fn().mockResolvedValue(mockAlcohols);
      Alcohol.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      const result = await alcoholDAO.getAllAlcohols(mockFilter, mockOptions);

      expect(Alcohol.find).toHaveBeenCalledWith(mockFilter);
      expect(Alcohol.sort).toHaveBeenCalledWith(mockOptions.sort);
      expect(Alcohol.skip).toHaveBeenCalledWith(0);
      expect(Alcohol.limit).toHaveBeenCalledWith(mockOptions.limit);
      expect(Alcohol.countDocuments).toHaveBeenCalledWith(mockFilter);

      expect(result).toEqual({
        alcohols: mockAlcohols,
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

  describe('getAlcoholById', () => {
    it('should return alcohol by id', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockAlcohol = {
        _id: mockId,
        name: 'Test Alcohol'
      };

      Alcohol.findById = jest.fn().mockReturnThis();
      Alcohol.lean = jest.fn().mockResolvedValue(mockAlcohol);

      const result = await alcoholDAO.getAlcoholById(mockId);

      expect(Alcohol.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockAlcohol);
    });

    it('should return null when alcohol not found', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();

      Alcohol.findById = jest.fn().mockReturnThis();
      Alcohol.lean = jest.fn().mockResolvedValue(null);

      const result = await alcoholDAO.getAlcoholById(mockId);

      expect(Alcohol.findById).toHaveBeenCalledWith(mockId);
      expect(result).toBeNull();
    });
  });

  describe('updateAlcohol', () => {
    it('should update alcohol', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockUpdateData = { name: 'Updated Alcohol' };
      const mockUpdatedAlcohol = {
        _id: mockId,
        ...mockUpdateData
      };

      Alcohol.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedAlcohol);

      const result = await alcoholDAO.updateAlcohol(mockId, mockUpdateData);

      expect(Alcohol.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockUpdateData,
        { new: true, runValidators: true, lean: true }
      );
      expect(result).toEqual(mockUpdatedAlcohol);
    });
  });

  describe('deleteAlcohol', () => {
    it('should delete alcohol', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockDeletedAlcohol = {
        _id: mockId,
        name: 'Deleted Alcohol'
      };

      Alcohol.findByIdAndDelete = jest.fn().mockReturnThis();
      Alcohol.lean = jest.fn().mockResolvedValue(mockDeletedAlcohol);

      const result = await alcoholDAO.deleteAlcohol(mockId);

      expect(Alcohol.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockDeletedAlcohol);
    });
  });
});
