const mongoose = require('mongoose');
const TravelDiaryService = require('../../../src/services/travelDiary.service');
const TravelDiaryDAL = require('../../../src/dal/travelDiary.dal');

// Mock TravelDiaryDAL
jest.mock('../../../src/dal/travelDiary.dal');

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

describe('TravelDiaryService Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDiary', () => {
    it('should create a new diary', async () => {
      const diaryData = {
        title: mockDiary.title,
        content: mockDiary.content,
        location: mockDiary.location,
        images: mockDiary.images,
        tags: mockDiary.tags
      };

      TravelDiaryDAL.create.mockResolvedValue(mockDiary);

      const result = await TravelDiaryService.createDiary(diaryData, mockUserId);

      expect(TravelDiaryDAL.create).toHaveBeenCalledWith({
        ...diaryData,
        userId: mockUserId,
        createdBy: mockUserId,
        updatedBy: mockUserId
      });
      expect(result).toEqual(mockDiary);
    });
  });

  describe('listDiaries', () => {
    it('should list diaries with pagination', async () => {
      const mockResult = {
        diaries: [mockDiary],
        total: 1
      };

      TravelDiaryDAL.findAll.mockResolvedValue(mockResult);

      const result = await TravelDiaryService.listDiaries(
        {},
        { page: 1, limit: 10 },
        mockUserId
      );

      expect(TravelDiaryDAL.findAll).toHaveBeenCalledWith(
        { userId: mockUserId },
        { skip: 0, limit: 10, sort: { createdAt: -1 } }
      );
      expect(result).toEqual({
        diaries: mockResult.diaries,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should apply filters when listing diaries', async () => {
      const filters = { tags: ['温泉'] };
      const mockResult = {
        diaries: [mockDiary],
        total: 1
      };

      TravelDiaryDAL.findAll.mockResolvedValue(mockResult);

      await TravelDiaryService.listDiaries(
        filters,
        { page: 1, limit: 10 },
        mockUserId
      );

      expect(TravelDiaryDAL.findAll).toHaveBeenCalledWith(
        { userId: mockUserId, ...filters },
        { skip: 0, limit: 10, sort: { createdAt: -1 } }
      );
    });
  });

  describe('getDiary', () => {
    it('should get diary by id', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(mockDiary);

      const result = await TravelDiaryService.getDiary(mockDiaryId);

      expect(TravelDiaryDAL.findById).toHaveBeenCalledWith(mockDiaryId);
      expect(result).toEqual(mockDiary);
    });

    it('should throw error if diary not found', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(null);

      await expect(TravelDiaryService.getDiary(mockDiaryId))
        .rejects
        .toThrow('未找到游记');
    });
  });

  describe('updateDiary', () => {
    const updateData = {
      title: '更新后的标题',
      content: '更新后的内容'
    };

    it('should update diary if user is owner', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(mockDiary);
      TravelDiaryDAL.update.mockResolvedValue({
        ...mockDiary,
        ...updateData,
        updatedBy: mockUserId
      });

      const result = await TravelDiaryService.updateDiary(
        mockDiaryId,
        updateData,
        mockUserId
      );

      expect(TravelDiaryDAL.update).toHaveBeenCalledWith(
        mockDiaryId,
        { ...updateData, updatedBy: mockUserId }
      );
      expect(result.title).toBe(updateData.title);
    });

    it('should throw error if user is not owner', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(mockDiary);

      await expect(TravelDiaryService.updateDiary(
        mockDiaryId,
        updateData,
        new mongoose.Types.ObjectId()
      )).rejects.toThrow('没有权限更新此游记');
    });
  });

  describe('deleteDiary', () => {
    it('should delete diary if user is owner', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(mockDiary);
      TravelDiaryDAL.delete.mockResolvedValue(mockDiary);

      await TravelDiaryService.deleteDiary(mockDiaryId, mockUserId);

      expect(TravelDiaryDAL.delete).toHaveBeenCalledWith(mockDiaryId);
    });

    it('should throw error if user is not owner', async () => {
      TravelDiaryDAL.findById.mockResolvedValue(mockDiary);

      await expect(TravelDiaryService.deleteDiary(
        mockDiaryId,
        new mongoose.Types.ObjectId()
      )).rejects.toThrow('没有权限删除此游记');
    });
  });
});
