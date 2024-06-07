const drinkDAO = require('../dao/drinkDAO');

const drinkService = {
  queryDrinks: async (query) => {
    console.log('query:', query);
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let condition = query.condition || {};
      let result = await drinkDAO.getDrinkList(page, limit, condition);
      // let count = await drinkDAO.getDrinkCount(condition);
      return { list: result };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

};

module.exports = drinkService;
