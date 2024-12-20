const alcoholModel = require('../model/alcohol');

const alcoholService = {
  queryAlcoholList: async (query) => {
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
    try {
      let alcoholList = await alcoholModel.find(condition).skip((page - 1) * limit).limit(limit);
      let total = await alcoholModel.countDocuments(condition);
      return { msg: 'Query alcohol list success', data: { list: alcoholList, total: total } };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 添加
  async alcoholAdd(req, res, next) {
    try {
      const alcohol = new alcoholModel(req.body);
      await alcohol.save();
      res.json(alcohol);
    } catch (error) {
      console.log('alcoholAdd', error);
      res.json(error);
    }
  },
};

module.exports = alcoholService;