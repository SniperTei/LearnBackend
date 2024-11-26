import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  menu_permissions: {
    type: [String],
    required: true,
  },
});
const Account = mongoose.model("Account", AccountSchema);
export default Account;