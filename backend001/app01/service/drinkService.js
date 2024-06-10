const drinkDAO = require('../dao/drinkDAO');
const moment = require('moment');

const drinkService = {
  queryDrinks: async (query) => {
    console.log('query:', query);
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let condition = query.condition || {};
      // let result = await drinkDAO.getDrinkList(page, limit, condition);
      let result = await drinkDAO.getDrinkListAndAlcoholInfo(page, limit, condition);
      // 遍历结果 把drink_date转换为yyyy-MM-dd格式
      result.forEach((item) => {
        item.drink_date = moment(item.drink_date).format('YYYY-MM-DD');
      });
      // let count = await drinkDAO.getDrinkCount(condition);
      return { list: result };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

};

module.exports = drinkService;
