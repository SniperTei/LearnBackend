const alcoholTypeModel = require('../model/alcohol_type');
const moment = require('moment');

const alcoholTypeService = {

  async queryAlcoholTypeList(query) {
    try {
      let page = 1;
      let limit = 10;
      let condition = {};
      if (query.page) {
        page = parseInt(query.page);
      }
      if (query.limit) {
        limit = parseInt(query.limit);
      }
      if (query.condition) { // 查询条件
        for (let key in query.condition) {
          if (query.condition[key]) {
            condition[key] = query.condition[key];
          }
        }
      }
      let result = await alcoholTypeModel.find(condition).skip((page - 1) * limit).limit(limit);
      result = result.map(alcoholType => {
        return {
          ...alcoholType._doc,
          updated_at: moment(alcoholType.updated_at).format('YYYY-MM-DD HH:mm:ss')
        };
      });
      let total = await alcoholTypeModel.countDocuments(condition);
      return { msg: 'Query alcohol type list success', data: { list: result, total: total } };
    } catch (error) {
      console.log('queryAlcoholTypeList', error);
      throw new Error(error.message);
    }
  },
  
  async addAlcoholTypes(params) {
    try {
      const { alcohol_type, alcohol_subtype, updated_by } = params;
      const alcoholType = new alcoholTypeModel({
        alcohol_type,
        alcohol_subtype,
        updated_at: new Date(),
        updated_by,
      });
      await alcoholType.save();
      return { msg: 'Add alcohol type success' };
    } catch (error) {
      console.log('addAlcoholTypes', error);
      throw new Error(error.message);
    }
  }
};

module.exports = alcoholTypeService;