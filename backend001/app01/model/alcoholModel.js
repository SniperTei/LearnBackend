import mongoose from "mongoose";

const AlcoholSchema = new mongoose.Schema({
  alcohol_name: {
    type: String,
    required: true,
  },
  alcohol_type: {
    type: String,
    required: true,
  },
  alcohol_subtype: {
    type: String,
    required: true,
  },
  nan_rating: {
    type: String,
    required: true,
  },
  nan_review: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const Alcohol = mongoose.model("Alcohol", AlcoholSchema);
export default Alcohol;
