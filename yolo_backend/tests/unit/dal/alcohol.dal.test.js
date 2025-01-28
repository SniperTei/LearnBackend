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

      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(mockAlcohols);
      const mockCountDocuments = jest.fn().mockResolvedValue(mockTotal);

      alcoholDAO.Alcohol.find = mockFind;
      alcoholDAO.Alcohol.find().sort = mockSort;
      alcoholDAO.Alcohol.find().sort().skip = mockSkip;
      alcoholDAO.Alcohol.find().sort().skip().limit = mockLimit;
      alcoholDAO.Alcohol.find().sort().skip().limit().lean = mockLean;
      alcoholDAO.Alcohol.countDocuments = mockCountDocuments;

      const result = await alcoholDAO.getAllAlcohols(mockFilter, mockOptions);

      expect(mockFind).toHaveBeenCalledWith(mockFilter);
      expect(mockSort).toHaveBeenCalledWith(mockOptions.sort);
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(mockOptions.limit);
      expect(mockCountDocuments).toHaveBeenCalledWith(mockFilter);

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

      const mockFindById = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(mockAlcohol);

      alcoholDAO.Alcohol.findById = mockFindById;
      alcoholDAO.Alcohol.findById().lean = mockLean;

      const result = await alcoholDAO.getAlcoholById(mockId);

      expect(mockFindById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockAlcohol);
    });

    it('should return null when alcohol not found', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();

      const mockFindById = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(null);

      alcoholDAO.Alcohol.findById = mockFindById;
      alcoholDAO.Alcohol.findById().lean = mockLean;

      const result = await alcoholDAO.getAlcoholById(mockId);

      expect(mockFindById).toHaveBeenCalledWith(mockId);
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

      const mockFindByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedAlcohol);
      alcoholDAO.Alcohol.findByIdAndUpdate = mockFindByIdAndUpdate;

      const result = await alcoholDAO.updateAlcohol(mockId, mockUpdateData);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
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

      const mockFindByIdAndDelete = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(mockDeletedAlcohol);

      alcoholDAO.Alcohol.findByIdAndDelete = mockFindByIdAndDelete;
      alcoholDAO.Alcohol.findByIdAndDelete().lean = mockLean;

      const result = await alcoholDAO.deleteAlcohol(mockId);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockDeletedAlcohol);
    });
  });
});
