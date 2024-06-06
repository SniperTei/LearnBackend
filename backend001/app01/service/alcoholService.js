const { query } = require('express');
const alcoholDAO = require('../dao/alcoholDAO');

const alcoholService = {
  
    queryAlcohols: async (query) => {
      console.log('query:', query);
      try {
        let page = query.page || 1;
        let limit = query.limit || 10;
        let condition = query.condition || {};
        let result = await alcoholDAO.getAlcoholList(page, limit, condition);
        let count = await alcoholDAO.getAlcoholCount(condition);
        return { list: result, total: count };
      } catch (error) {
        console.error('An error occurred:', error);
        throw error;
      }
    },
  
    // queryAlcoholById: async (query) => {
    //   try {
    //     let page = query.page || 1;
    //     let limit = query.limit || 10;
    //     let alcoholId = query.alcoholId || {};
    //     let result = await alcoholDAO.getAlcohol(alcoholId);
    //     if (result.length > 0) {
    //       return result[0];
    //     } else {
    //       return {};
    //     }
    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //     throw error;
    //   }
    // },
  
    // addAlcohol: async (alcohol) => {
    //   try {
    //     let result = await alcoholDAO.addAlcohol(alcohol);
    //     console.log('result:', result);
    //     return result;
    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //     throw error;
    //   }
    // }
  };

module.exports = alcoholService;