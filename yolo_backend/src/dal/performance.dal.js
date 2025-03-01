const Performance = require('../models/performance.model');

class PerformanceDAO {
  constructor() {
    this.Performance = Performance;
  }

  async create(performanceData) {
    const performance = new this.Performance(performanceData);
    return await performance.save();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = { performanceDate: -1 } } = options;
    const skip = (page - 1) * limit;

    const [performances, total] = await Promise.all([
      this.Performance
        .find(filter)
        .populate('customerId', 'name medicalRecordNumber')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.Performance.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      performances,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async findById(id) {
    return await this.Performance.findById(id)
      .populate('customerId', 'name medicalRecordNumber')
      .lean();
  }

  async update(id, updateData) {
    return await this.Performance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, lean: true }
    ).populate('customerId', 'name medicalRecordNumber');
  }

  async delete(id) {
    return await this.Performance.findByIdAndDelete(id).lean();
  }
}

module.exports = PerformanceDAO; 