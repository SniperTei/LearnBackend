const Drink = require('../models/drink.model');

class DrinkDAO {
  async createDrink(drinkData) {
    const drink = new Drink(drinkData);
    return await drink.save();
  }

  async getAllDrinks(userId) {
    return await Drink.find({ userId })
      .sort({ drinkTime: -1 }); // 按饮酒时间倒序排列，最新的记录在前
  }

  async getDrinkById(id) {
    return await Drink.findById(id);
  }

  async updateDrink(id, drinkData) {
    return await Drink.findByIdAndUpdate(id, drinkData, { new: true });
  }

  async deleteDrink(id) {
    return await Drink.findByIdAndDelete(id);
  }
}

module.exports = new DrinkDAO();
