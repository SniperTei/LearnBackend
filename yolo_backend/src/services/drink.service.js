const drinkDAO = require('../dal/drink.dal');

class DrinkService {

  constructor() {
    this.drinkDAO = new drinkDAO();
  }

  /**
   * 创建饮品记录
   * @param {Object} drinkData - 饮品记录数据
   * @returns {Promise<Object>} 创建的饮品记录
   */
  async createDrink(drinkData) {
    return await this.drinkDAO.createDrink(drinkData);
  }

  /**
   * 获取饮品记录列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Object>} 包含分页信息的饮品记录列表
   */
  async getAllDrinks(filter, options) {
    const drinks = await drinkDAO.getAllDrinks(filter, options);
    const total = await drinkDAO.countDrinks(filter);
    const totalPages = Math.ceil(total / options.limit);

    return {
      drinks,
      pagination: {
        total,
        totalPages,
        currentPage: options.page,
        limit: options.limit,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1
      }
    };
  }

  /**
   * 获取单个饮品记录
   * @param {string} id - 饮品记录ID
   * @returns {Promise<Object>} 饮品记录
   */
  async getDrinkById(id) {
    return await drinkDAO.getDrinkById(id);
  }

  /**
   * 更新饮品记录
   * @param {string} id - 饮品记录ID
   * @param {Object} drinkData - 更新的数据
   * @returns {Promise<Object>} 更新后的饮品记录
   */
  async updateDrink(id, drinkData) {
    return await drinkDAO.updateDrink(id, drinkData);
  }

  /**
   * 删除饮品记录
   * @param {string} id - 饮品记录ID
   * @returns {Promise<Object>} 删除的饮品记录
   */
  async deleteDrink(id) {
    return await drinkDAO.deleteDrink(id);
  }
}

module.exports = DrinkService;
