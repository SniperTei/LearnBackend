const drinkDAO = require('../dal/drink.dal');

class DrinkService {
  async createDrink(drinkData) {
    return await drinkDAO.createDrink(drinkData);
  }

  async getAllDrinks() {
    return await drinkDAO.getAllDrinks();
  }

  async getDrinkById(id) {
    return await drinkDAO.getDrinkById(id);
  }

  async updateDrink(id, drinkData) {
    return await drinkDAO.updateDrink(id, drinkData);
  }

  async deleteDrink(id) {
    return await drinkDAO.deleteDrink(id);
  }
}

module.exports = new DrinkService();
