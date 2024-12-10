const foodModel = require('../model/food');

const foodService = {
  queryFoodList: async (query) => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = parseInt(query.page);
    }
    if (query.limit) {
      limit = parseInt(query.limit);
    }
    try {
      let foodList = await foodModel.find().skip((page - 1) * limit).limit(limit);
      let total = await foodModel.countDocuments();
      return { msg: 'Query food list success', data: { list: foodList, total: total } };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 添加
  foodAdd: async (params) => {
    try {
      const { name, category, price, image, recipe, description } = params;
      const food = new foodModel({
        name,
        category,
        price,
        image,
        recipe,
        description,
      });
      await food.save();
      return { msg: 'Add food success' };
    } catch (error) {
      console.log('foodAdd', error);
      throw new Error(error.message);
    }
  },
};

module.exports = foodService;