const drinkModel = require('../model/drink');
const moment = require('moment');

const drinkService = {
  // 查询
  queryDrinkList: async (params) => {
    let page = 1;
    let limit = 10;
    if (params.page) {
      page = parseInt(params.page);
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    try {
      // drinkModel和alcoholModel的聚合查询
      const result = await drinkModel.aggregate([
        {
          // 连接查询
          $lookup: {
            from: 'alcohol',
            localField: 'alcohol_id',
            foreignField: '_id',
            as: 'drink_alcohol_info',
          },
        },
        {
          // 连接user查昵称
          $lookup: {
            from: 'user_profile',
            localField: 'drinker_username',
            foreignField: 'username',
            as: 'drinker_info'
          }
        },
        {
          // 将数组字段拆分为多个文档
          $unwind: '$drink_alcohol_info',
        },
        {
          // 将数组字段拆分为多个文档
          $unwind: '$drinker_info',
        },
        {
          // 选择字段
          $project: {
            drinker_username: 1, // 1表示显示，0表示不显示
            drink_date: 1,
            drink_location: 1,
            drink_amount: 1,
            drink_unit: 1,
            drinker_nickname: '$drinker_info.nickname',
            alcohol_name: '$drink_alcohol_info.alcohol_name',
          },
        },
        // {
        //   $sort: { drink_date: -1 },
        // },
        // {
        //   $skip: (page - 1) * limit,
        // },
        // {
        //   $limit: limit,
        // },
      ]);
      // result中吧drink_date转换为字符串
      result.forEach(drink => {
        drink.drink_date = moment(drink.drink_date).format('YYYY-MM-DD');
      });
      console.log('result:', result);
      return { msg: 'Query drink list success', data: { list: result} };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // 添加
  async drinkAdd(params) {
    try {
      // drinker_username,drink_date,drink_location,alcohol_id,drink_amount,drink_unit
      const { drinker_username, drink_date, drink_location, alcohol_id, drink_amount, drink_unit } = params;
      const drink = new drinkModel({
        drinker_username,
        drink_date,
        drink_location,
        alcohol_id,
        drink_amount,
        drink_unit,
      });
      await drink.save();
      return { msg: 'Add drink success' };
    } catch (error) {
      console.log('drinkAdd', error);
      throw new Error(error.message);
    }
  },
};

module.exports = drinkService;