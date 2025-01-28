const DictionaryController = require('../../../src/controllers/dictionary.controller');
const DictionaryService = require('../../../src/services/dictionary.service');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/services/dictionary.service');

describe('DictionaryController', () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new DictionaryController();
    mockReq = {
      query: {},
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDictionariesByGroups', () => {
    it('should get dictionaries by groups successfully', async () => {
      const groups = 'group1,group2';
      mockReq.query = { groups };

      const mockDictionaries = {
        group1: [{ key: 'key1', value: 'value1' }],
        group2: [{ key: 'key2', value: 'value2' }]
      };

      jest.spyOn(controller.dictionaryService, 'getDictionariesByGroups')
        .mockResolvedValue(mockDictionaries);

      await controller.getDictionariesByGroups(mockReq, mockRes);

      expect(controller.dictionaryService.getDictionariesByGroups)
        .toHaveBeenCalledWith(groups);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockDictionaries
        })
      );
    });

    it('should return 400 when groups parameter is missing', async () => {
      mockReq.query = {}; // No groups parameter

      await controller.getDictionariesByGroups(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: expect.stringContaining('请指定字典分组')
        })
      );
    });

    it('should handle service errors', async () => {
      mockReq.query = { groups: 'group1' };
      const error = new Error('Service error');
      
      jest.spyOn(controller.dictionaryService, 'getDictionariesByGroups')
        .mockRejectedValue(error);

      await controller.getDictionariesByGroups(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: error.message
        })
      );
    });
  });
});
