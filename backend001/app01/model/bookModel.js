import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  pubdate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});
const Book = mongoose.model("Book", BookSchema);
export default Book;