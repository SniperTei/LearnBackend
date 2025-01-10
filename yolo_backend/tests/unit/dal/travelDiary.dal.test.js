const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const TravelDiaryDAL = require('../../../src/dal/travelDiary.dal');
const TravelDiary = require('../../../src/models/travelDiary.model');
const User = require('../../../src/models/user.model');
const TravelPlan = require('../../../src/models/travelPlan.model');

let mongoServer;

const mockUserId = new mongoose.Types.ObjectId();
const mockUser = {
  _id: mockUserId,
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  birthDate: new Date('1990-01-01'),
  gender: 'male'
};

const mockDiary = {
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

describe('TravelDiaryDAL Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.create(mockUser);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await TravelDiary.deleteMany({});
  });

  describe('create', () => {
    it('should create a new diary', async () => {
      const diary = await TravelDiaryDAL.create(mockDiary);
      expect(diary.title).toBe(mockDiary.title);
      expect(diary.content).toBe(mockDiary.content);
      expect(diary.location.country).toBe(mockDiary.location.country);
      expect(diary.tags).toEqual(expect.arrayContaining(mockDiary.tags));
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await TravelDiary.create(mockDiary);
      await TravelDiary.create({
        ...mockDiary,
        title: '另一个游记',
        tags: ['美食', '日本']
      });
    });

    it('should find all diaries with pagination', async () => {
      const { diaries, total } = await TravelDiaryDAL.findAll({}, { skip: 0, limit: 10 });
      expect(diaries).toHaveLength(2);
      expect(total).toBe(2);
    });

    it('should filter diaries by tags', async () => {
      const { diaries, total } = await TravelDiaryDAL.findAll(
        { tags: { $in: ['温泉'] } },
        { skip: 0, limit: 10 }
      );
      expect(diaries).toHaveLength(1);
      expect(total).toBe(1);
      expect(diaries[0].tags).toContain('温泉');
    });
  });

  describe('findById', () => {
    let createdDiary;

    beforeEach(async () => {
      createdDiary = await TravelDiary.create(mockDiary);
    });

    it('should find diary by id', async () => {
      const diary = await TravelDiaryDAL.findById(createdDiary._id);
      expect(diary.title).toBe(mockDiary.title);
      expect(diary._id.toString()).toBe(createdDiary._id.toString());
    });

    it('should return null for non-existent id', async () => {
      const diary = await TravelDiaryDAL.findById(new mongoose.Types.ObjectId());
      expect(diary).toBeNull();
    });
  });

  describe('update', () => {
    let createdDiary;

    beforeEach(async () => {
      createdDiary = await TravelDiary.create(mockDiary);
    });

    it('should update diary', async () => {
      const updatedData = {
        title: '更新后的游记标题',
        content: '更新后的内容'
      };

      const diary = await TravelDiaryDAL.update(createdDiary._id, updatedData);
      expect(diary.title).toBe(updatedData.title);
      expect(diary.content).toBe(updatedData.content);
      expect(diary.location.country).toBe(mockDiary.location.country);
    });
  });

  describe('delete', () => {
    let createdDiary;

    beforeEach(async () => {
      createdDiary = await TravelDiary.create(mockDiary);
    });

    it('should delete diary', async () => {
      await TravelDiaryDAL.delete(createdDiary._id);
      const diary = await TravelDiary.findById(createdDiary._id);
      expect(diary).toBeNull();
    });
  });
});
