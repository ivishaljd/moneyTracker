const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");
dotenv.config();

module.exports.welcome = async (req, res) => {
  res.send("Welcome to Money tracker");
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user === null) {
    res.send("notfound");
  } else {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const userdata = {
        firstName: user.firstName,
        lastName: user.lastName,
        monthCycle: user.monthCycle,
        monthlyBudget: user.monthlyBudget,
      };
      const token = jwt.sign(
        {
          email: email,
        },
        "MoneyTrackerjwtencryption@1200",
        { expiresIn: "12h" }
      );
      res.send({ stat: "sucess", token: token, userdata: userdata });
    } else {
      res.send({ stat: "fail" });
    }
  }
};

module.exports.sendotp = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (user === null) {
    res.send({ stat: false });
  } else {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp } },
      { upsert: true }
    );
    res.send({ stat: true, otp: otp });
  }
};

module.exports.resetpassword = async (req, res) => {
  const { email, password, otp } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user.otp > 0 && user.otp == otp) {
    const saltRounds = 10;
    const myPlaintextPassword = password;
    const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
    const newpassword = hashedPassword;
    await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: newpassword, otp: 0 } },
      { upsert: true }
    );
    res.send({ stat: true });
  } else {
    res.send({ stat: false });
  }
};

module.exports.signup = async (req, res) => {
  let data = req.body;
  const { email, password } = data;
  const saltRounds = 10;
  const myPlaintextPassword = password;
  const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
  data.password = hashedPassword;

  const user = await UserModel.findOne({ email: email });
  if (user === null) {
    UserModel.create(data)
      .then((data) => {
        res.status(201).send("created");
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.send("already exist");
  }
};

module.exports.verify = async (req, res) => {
  const token = req.headers["token"];
  try {
    const decode = await jwt.verify(token, "MoneyTrackerjwtencryption@1200");
    if (decode) {
      const user = await UserModel.findOne({ email: decode.email });
      user.password = "";

      res.send({ stat: true, decode, user });
    } else {
      res.send({ stat: false });
    }
  } catch (err) {
    res.send({ stat: false, err: err.message });
  }
};

module.exports.update = async (req, res) => {
  const token = req.headers["token"];
  let field = req.headers["field"];
  let updates = req.headers["updates"];
  try {
    if (field == "monthCycle") {
      if (isNaN(updates) || updates < 1 || updates > 30) {
        throw new Error("invalid date it must be between 1 and 30");
      }
      // Get today's date
      const today = new Date();
      const currentDay = today.getDate();
      const inputDay = parseInt(updates, 10);

      // Compare the input date with today's date
      if (inputDay <= currentDay) {
        // If the input date is equal or less than today's date, use the next month and same year
        let nextMonth = today.getMonth() + 2;
        let nextYear = today.getFullYear();

        if (nextMonth > 12) {
          // If the next month exceeds December, adjust month and year accordingly
          nextMonth = 1; // January (1-based month)
          nextYear += 1;
        }

        const outputDay = updates.toString().padStart(2, "0");
        const outputMonth = nextMonth.toString().padStart(2, "0");
        const formattedDate = `${outputDay}/${outputMonth}/${nextYear}`;
        updates = formattedDate;
      } else {
        // If the input date is bigger than today's date, use the current month and year
        const currentMonth = today.getMonth() + 1; // Adding 1 to get the correct month (1-based).
        const currentYear = today.getFullYear();
        const formattedDate = `${updates
          .toString()
          .padStart(2, "0")}/${currentMonth
          .toString()
          .padStart(2, "0")}/${currentYear}`;
        updates = formattedDate;
      }
    }

    const decode = await jwt.verify(token, "MoneyTrackerjwtencryption@1200");

    if (decode) {
      await UserModel.findOneAndUpdate(
        { email: decode.email },
        { $set: { [field]: updates } }
      );
      res.send({ stat: true, decode });
    } else {
      res.send({ stat: false, message: "Something Went Wrong!!" });
    }
  } catch (err) {
    res.send({ stat: false, message: err.message });
  }
};

module.exports.addwallet = async (req, res) => {
  const token = req.headers["token"];
  let walletname = req.headers["walletname"];
  const amount = req.headers["amount"];

  try {
    const decode = await jwt.verify(token, "MoneyTrackerjwtencryption@1200");

    if (decode) {
      const data = await UserModel.findOneAndUpdate(
        { email: decode.email },
        { $push: { Wallets: { name: walletname, amount: parseInt(amount) } } },
        { new: true }
      );
      res.send({ stat: true, decode, wallets: data.Wallets });
    } else {
      res.send({ stat: false });
    }
  } catch (err) {
    res.send({ stat: false, err: err.message });
  }
};

module.exports.addTransaction = async (req, res) => {
  const transaction = req.body;
  const token = req.headers["token"];
  const { wallet } = transaction;

  try {
    const decode = await jwt.verify(token, "MoneyTrackerjwtencryption@1200");
    let resp;
    if (decode) {
      const change = parseInt(transaction.amount);
      if (transaction.type == "expense") {
        resp = await UserModel.findOneAndUpdate(
          {
            email: decode.email,
            [`Wallets.${wallet}.amount`]: { $gt: change },
          },
          {
            $inc: {
              [`Wallets.${wallet}.amount`]: -change,
              dailyexpense: change,
            },
            $push: { transactions: { $each: [transaction], $position: 0 } },
          }
        );
      } else {
        resp = await UserModel.findOneAndUpdate(
          { email: decode.email },
          {
            $inc: {
              [`Wallets.${wallet}.amount`]: change,
            },
            $push: { transactions: { $each: [transaction], $position: 0 } },
          }
        );
      }
      if (resp !== null) {
        const data = await UserModel.findOne({ email: decode.email });
        res.send({
          stat: true,
          decode,
          transactions: data.transactions,
          dailyexpense: data.dailyexpense,
        });
      } else {
        res.send({
          stat: false,
          decode,
          message: "Amount is greater than Balance",
        });
      }
    } else {
      res.send({ stat: false, message: "something went wrong" });
    }
  } catch (err) {
    res.send({ stat: false, message: err.message });
  }
};
