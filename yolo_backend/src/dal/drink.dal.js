const Drink = require('../models/drink.model');

class DrinkDAO {
  async createDrink(drinkData) {
    const drink = new Drink(drinkData);
    return await drink.save();
  }

  async getAllDrinks() {
    return await Drink.find();
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
