const PerformanceDAL = require('../dal/performance.dal');
const CustomerService = require('./customer.service');

class PerformanceService {
  constructor() {
    this.customerService = new CustomerService();
  }

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

  async createCustomerWithPerformance(data, userId) {
    try {
      // 1. 创建客户
      const customerData = {
        name: data.name,
        avatarUrl: data.avatarUrl,
        medicalRecordNumber: data.medicalRecordNumber,
        lastPurchaseDate: data.lastPurchaseDate,
        remarks: data.customerRemarks
      };
      
      const customer = await this.customerService.createCustomer(customerData, userId);

      // 2. 创建performance记录
      const performanceData = {
        customerId: customer.customerId,
        performanceDate: data.performanceDate,
        performanceType: data.performanceType,
        amount: data.amount,
        itemA: data.itemA,
        itemB: data.itemB,
        remarks: data.performanceRemarks
      };

      const performance = await this.createPerformance(performanceData);

      // 3. 返回组合数据
      return {
        customer,
        performance
      };
    } catch (error) {
      throw new Error(`创建客户和消费记录失败: ${error.message}`);
    }
  }
}

module.exports = new PerformanceService(); 