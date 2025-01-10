const mongoose = require('mongoose');
const TravelDiaryController = require('../../../src/controllers/travelDiary.controller');
const TravelDiaryService = require('../../../src/services/travelDiary.service');

// Mock TravelDiaryService
jest.mock('../../../src/services/travelDiary.service');

const mockUserId = new mongoose.Types.ObjectId();
const mockDiaryId = new mongoose.Types.ObjectId();

const mockDiary = {
  _id: mockDiaryId,
  title: '京都温泉游记',
  content: '今天去了岚山温泉，体验了日本传统的温泉文化...',
  location: {
    country: '日本',
    city: '京都',
    place: '岚山温泉'
  },
  images: [
    {
      url: 'http://example.com/image1.jpg',
      caption: '岚山温泉外景'
    }
  ],
  tags: ['温泉', '日本', '京都'],
  userId: mockUserId,
  createdBy: mockUserId,
  updatedBy: mockUserId
};

describe('TravelDiaryController Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: { userId: mockUserId },
      params: {},
      query: {},
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listDiaries', () => {
    const mockDiaryList = {
      diaries: [mockDiary],
      totalPages: 1,
      currentPage: 1
    };

    it('should list diaries successfully', async () => {
      mockReq.query = { page: '1', limit: '10' };
      TravelDiaryService.listDiaries.mockResolvedValue(mockDiaryList);

      await TravelDiaryController.listDiaries(mockReq, mockRes, mockNext);

      expect(TravelDiaryService.listDiaries).toHaveBeenCalledWith(
        {},
        { page: '1', limit: '10' },
        mockUserId
      );
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: '000000',
        statusCode: 200,
        msg: 'Success',
        data: mockDiaryList
      }));
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      TravelDiaryService.listDiaries.mockRejectedValue(error);

      await TravelDiaryController.listDiaries(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getDiary', () => {
    it('should get diary successfully', async () => {
      mockReq.params.id = mockDiaryId;
      TravelDiaryService.getDiary.mockResolvedValue(mockDiary);

      await TravelDiaryController.getDiary(mockReq, mockRes, mockNext);

      expect(TravelDiaryService.getDiary).toHaveBeenCalledWith(mockDiaryId);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: '000000',
        statusCode: 200,
        msg: 'Success',
        data: mockDiary
      }));
    });

    it('should handle not found error', async () => {
      mockReq.params.id = mockDiaryId;
      const error = new Error('未找到游记');
      error.statusCode = 404;
      TravelDiaryService.getDiary.mockRejectedValue(error);

      await TravelDiaryController.getDiary(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createDiary', () => {
    it('should create diary successfully', async () => {
      mockReq.body = {
        title: mockDiary.title,
        content: mockDiary.content,
        location: mockDiary.location,
        images: mockDiary.images,
        tags: mockDiary.tags
      };
      TravelDiaryService.createDiary.mockResolvedValue(mockDiary);

      await TravelDiaryController.createDiary(mockReq, mockRes, mockNext);

      expect(TravelDiaryService.createDiary).toHaveBeenCalledWith(
        mockReq.body,
        mockUserId
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: '000000',
        statusCode: 201,
        msg: '游记创建成功',
        data: mockDiary
      }));
    });

    it('should handle validation error', async () => {
      const error = new Error('Validation error');
      error.name = 'ValidationError';
      TravelDiaryService.createDiary.mockRejectedValue(error);

      await TravelDiaryController.createDiary(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'A00400',
        statusCode: 400,
        msg: error.message
      }));
    });
  });

  describe('updateDiary', () => {
    it('should update diary successfully', async () => {
      mockReq.params.id = mockDiaryId;
      mockReq.body = {
        title: '更新后的标题',
        content: '更新后的内容'
      };
      const updatedDiary = { ...mockDiary, ...mockReq.body };
      TravelDiaryService.updateDiary.mockResolvedValue(updatedDiary);

      await TravelDiaryController.updateDiary(mockReq, mockRes, mockNext);

      expect(TravelDiaryService.updateDiary).toHaveBeenCalledWith(
        mockDiaryId,
        mockReq.body,
        mockUserId
      );
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: '000000',
        statusCode: 200,
        msg: '游记更新成功',
        data: updatedDiary
      }));
    });

    it('should handle permission error', async () => {
      mockReq.params.id = mockDiaryId;
      const error = new Error('没有权限更新此游记');
      error.statusCode = 403;
      TravelDiaryService.updateDiary.mockRejectedValue(error);

      await TravelDiaryController.updateDiary(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteDiary', () => {
    it('should delete diary successfully', async () => {
      mockReq.params.id = mockDiaryId;
      TravelDiaryService.deleteDiary.mockResolvedValue();

      await TravelDiaryController.deleteDiary(mockReq, mockRes, mockNext);

      expect(TravelDiaryService.deleteDiary).toHaveBeenCalledWith(
        mockDiaryId,
        mockUserId
      );
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: '000000',
        statusCode: 200,
        msg: '游记删除成功',
        data: null
      }));
    });

    it('should handle permission error', async () => {
      mockReq.params.id = mockDiaryId;
      const error = new Error('没有权限删除此游记');
      error.statusCode = 403;
      TravelDiaryService.deleteDiary.mockRejectedValue(error);

      await TravelDiaryController.deleteDiary(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
