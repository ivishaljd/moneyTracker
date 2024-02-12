const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  monthCycle: {
    type: String,
  },
  budgetOfTheDay: {
    type: Number,
    default: 0,
  },
  dailyexpense: {
    type: Number,
    default: 0,
  },
  otp: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: Array,
  },
  Wallets: {
    type: Array,
    default: [{ name: "cash", amount: 0 }],
  },
});

module.exports = mongoose.model("User", userSchema);
