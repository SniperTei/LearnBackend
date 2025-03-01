const PerformanceDAL = require('../dal/performance.dal');

class PerformanceService {
  async createPerformance(performanceData) {
    return await PerformanceDAL.create(performanceData);
  }

  async getAllPerformances() {
    return await PerformanceDAL.findAll();
  }

  async getPerformanceById(id) {
    const performance = await PerformanceDAL.findById(id);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return performance;
  }

  async updatePerformance(id, updateData) {
    const performance = await PerformanceDAL.update(id, updateData);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return performance;
  }

  async deletePerformance(id) {
    const performance = await PerformanceDAL.delete(id);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return performance;
  }
}

module.exports = new PerformanceService(); 