import mongoose from "mongoose";

const DrinkSchema = new mongoose.Schema({
  drinker_username: {
    type: String,
    required: true,
  },
  drink_date: {
    type: Date,
    required: true,
  },
  drink_location: {
    type: String,
    required: true,
  },
  alcohol_id: {
    type: String,
    required: true,
  },
  drink_amount: {
    type: Number,
    required: true,
  },
});
const Drink = mongoose.model("Drink", DrinkSchema);
export default Drink;