import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // director: {
  //   type: String,
  //   required: true,
  // },
  actors: {
    type: [String],
    required: true,
  },
  // tags: {
  //   type: [String],
  //   required: true,
  // },
  genre: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  jyp_viewed: {
    type: String,
    required: true,
  },
  sniper_viewed: {
    type: String,
    required: true,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});
const Movie = mongoose.model("Movie", MovieSchema);
export default Movie;