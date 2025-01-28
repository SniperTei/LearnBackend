const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const TravelPlanDAL = require('../../../src/dal/travelPlan.dal');
const TravelPlan = require('../../../src/models/travelPlan.model');

let mongoServer;
let travelPlanDAL;

const mockTravelPlan = {
  title: '日本东京之旅',
  description: '一次难忘的东京之旅',
  startDate: '2025-03-01',
  endDate: '2025-03-07',
  destination: {
    country: '日本',
    city: '东京',
    locations: ['浅草寺', '秋叶原', '银座']
  },
  itinerary: [{
    day: 1,
    date: '2025-03-01',
    activities: [{
      time: '10:00',
      location: '浅草寺',
      activity: '参观浅草寺',
      duration: '2小时'
    }]
  }],
  userId: '507f1f77bcf86cd799439011',
  createdBy: '507f1f77bcf86cd799439011',
  updatedBy: '507f1f77bcf86cd799439011'
};

describe('TravelPlanDAL', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    travelPlanDAL = new TravelPlanDAL();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await TravelPlan.deleteMany({});
  });

  describe('create', () => {
    it('should create a new travel plan', async () => {
      const result = await travelPlanDAL.create(mockTravelPlan);
      
      expect(result.title).toBe(mockTravelPlan.title);
      expect(result.description).toBe(mockTravelPlan.description);
      expect(result.userId.toString()).toBe(mockTravelPlan.userId);
      expect(result.createdBy.toString()).toBe(mockTravelPlan.createdBy);
      expect(result.updatedBy.toString()).toBe(mockTravelPlan.updatedBy);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await travelPlanDAL.create(mockTravelPlan);
      await travelPlanDAL.create({
        ...mockTravelPlan,
        title: '大阪之旅',
        destination: { ...mockTravelPlan.destination, city: '大阪' }
      });
    });

    it('should return all travel plans with pagination', async () => {
      const { travelPlans, total } = await travelPlanDAL.findAll(
        { userId: mockTravelPlan.userId },
        { skip: 0, limit: 10 }
      );

      expect(travelPlans).toHaveLength(2);
      expect(total).toBe(2);
    });

    it('should filter travel plans by destination', async () => {
      const { travelPlans, total } = await travelPlanDAL.findAll(
        { 
          userId: mockTravelPlan.userId,
          'destination.city': '东京'
        },
        { skip: 0, limit: 10 }
      );

      expect(travelPlans).toHaveLength(1);
      expect(total).toBe(1);
      expect(travelPlans[0].destination.city).toBe('东京');
    });
  });

  describe('findById', () => {
    let createdTravelPlan;

    beforeEach(async () => {
      createdTravelPlan = await travelPlanDAL.create(mockTravelPlan);
    });

    it('should find travel plan by id', async () => {
      const result = await travelPlanDAL.findById(createdTravelPlan._id);

      expect(result._id.toString()).toBe(createdTravelPlan._id.toString());
      expect(result.title).toBe(mockTravelPlan.title);
    });

    it('should return null for non-existent id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await travelPlanDAL.findById(nonExistentId);

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await travelPlanDAL.create(mockTravelPlan);
    });

    it('should find travel plan by query', async () => {
      const result = await travelPlanDAL.findOne({ title: mockTravelPlan.title });

      expect(result.title).toBe(mockTravelPlan.title);
      expect(result.description).toBe(mockTravelPlan.description);
    });

    it('should return null for non-matching query', async () => {
      const result = await travelPlanDAL.findOne({ title: 'Non-existent Title' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    let createdTravelPlan;

    beforeEach(async () => {
      createdTravelPlan = await travelPlanDAL.create(mockTravelPlan);
    });

    it('should update travel plan', async () => {
      const updateData = {
        title: '更新后的东京之旅',
        description: '更新后的描述'
      };

      const result = await travelPlanDAL.update(createdTravelPlan._id, updateData);

      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
    });
  });

  describe('delete', () => {
    let createdTravelPlan;

    beforeEach(async () => {
      createdTravelPlan = await travelPlanDAL.create(mockTravelPlan);
    });

    it('should delete travel plan', async () => {
      await travelPlanDAL.delete(createdTravelPlan._id);

      const result = await travelPlanDAL.findById(createdTravelPlan._id);
      expect(result).toBeNull();
    });
  });
});
