const alcoholModel = require('../model/alcohol');
const alcoholTypeModel = require('../model/alcohol_type');

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
      let result = await alcoholModel.aggregate([
        {
          $lookup: {
            from: 'alcohol_type',
            localField: 'alcohol_type_id',
            foreignField: '_id',
            as: 'alcohol_type_info',
          }
        },
        {
          $unwind: '$alcohol_type_info',
        },
        {
          $project: {
            alcohol_name: 1,
            updated_at: 1,
            updated_by: 1,
            alcohol_type: '$alcohol_type_info.alcohol_type',
            alcohol_subtype: '$alcohol_type_info.alcohol_subtype',
          }
        }
      ]);
      console.log('result:', result);
      return { msg: 'Query alcohol list success', data: { list: result, total: result.length } };
      // let alcoholList = await alcoholModel.find(condition).skip((page - 1) * limit).limit(limit);
      // let total = await alcoholModel.countDocuments(condition);
      // return { msg: 'Query alcohol list success', data: { list: alcoholList, total: total } };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 添加
  async alcoholAdd(params) {
    try {
      const { alcohol_name, alcohol_type_id, nan_rating, nan_review, updated_by } = params;
      const alcohol = new alcoholModel({
        alcohol_name,
        alcohol_type_id,
        updated_at: new Date(),
        nan_rating,
        nan_review,
        updated_by,
      });
      await alcohol.save();
      return { msg: 'Add alcohol success' };
    } catch (error) {
      console.log('alcoholAdd', error);
      throw new Error(error.message);
    }
  },
  async tempAddAlcoholType(params) {
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
      console.log('tempAddAlcoholType', error);
      res.json(error);
    }
  }
};

module.exports = alcoholService;