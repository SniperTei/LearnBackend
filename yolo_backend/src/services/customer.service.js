const CustomerDAO = require('../dal/customer.dal');

class CustomerService {
  constructor() {
    this.customerDao = new CustomerDAO();
  }

  /**
   * 创建客户
   * @param {Object} customerData - 客户数据
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 创建的客户记录
   */
  async createCustomer(customerData, userId) {
    try {
      // 添加创建者和更新者ID
      const customerWithUser = {
        ...customerData,
        createdBy: userId,
        updatedBy: userId
      };
      
      const customer = await this.customerDao.createCustomer(customerWithUser);

      return this.formatCustomer(customer);
    } catch (error) {
      throw new Error(`创建客户失败: ${error.message}`);
    }
  }

  /**
   * 获取客户列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 选项（分页、排序等）
   * @returns {Promise<Object>} 客户列表和总数
   */
  async getAllCustomers(filter = {}, options = {}) {
    const result = await this.customerDao.getAllCustomers(filter, options);
    const customers = result.customers.map(customer => this.formatCustomer(customer));
    return {
      customers,
      pagination: result.pagination
    };
  }

  /**
   * 根据ID获取客户
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 客户记录
   */
  async getCustomerById(id) {
    const customer = await this.customerDao.getCustomerById(id);

    return this.formatCustomer(customer);
  }

  /**
   * 更新客户
   * @param {string} id - 客户ID
   * @param {Object} customerData - 更新的数据
   * @returns {Promise<Object>} 更新后的客户记录
   */
  async updateCustomer(id, customerData) {
    try {
      // 只提取允许更新的字段
      const updateData = {
        name: customerData.name,
        avatarUrl: customerData.avatarUrl,
        medicalRecordNumber: customerData.medicalRecordNumber,
        lastPurchaseDate: customerData.lastPurchaseDate,
        remarks: customerData.remarks,
        updatedBy: customerData.updatedBy // 这个字段由控制器传入
      };

      // 移除undefined的字段
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      const customer = await this.customerDao.updateCustomer(id, updateData);
      if (!customer) {
        throw new Error('Customer not found');
      }

      return this.formatCustomer(customer);
    } catch (error) {
      throw new Error(`更新客户失败: ${error.message}`);
    }
  }

  /**
   * 删除客户
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 删除的客户记录
  */
  async deleteCustomer(id) {
    const customer = await this.customerDao.deleteCustomer(id);
    return this.formatCustomer(customer);
  }

  /**
   * 格式化customer数据，将_id转换为customerId
   * @private
   */
  formatCustomer(customer) {
    if (!customer) return null;

    const { _id, __v, ...rest } = customer;
    return {
      customerId: _id.toString(),
      ...rest
    };
  }
}

module.exports = CustomerService;
