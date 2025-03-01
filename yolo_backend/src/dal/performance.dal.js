const Performance = require('../models/performance.model');

class PerformanceDAL {
  async create(performanceData) {
    const performance = new Performance(performanceData);
    return await performance.save();
  }

  async findAll() {
    return await Performance.find({});
  }

  async findById(id) {
    return await Performance.findById(id);
  }

  async update(id, updateData) {
    return await Performance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Performance.findByIdAndDelete(id);
  }
}

module.exports = new PerformanceDAL(); 