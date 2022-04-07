const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const User = require("../models/UserModel");
const { mailSender } = require("../utils/sendMail");
const { hashPassword } = require("../utils/passwordHashing");
require("dotenv").config();
app.use(express.json());

exports.signup = async function (req, res, next) {
  let createUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    createUser.password = await hashPassword(req.body.password);
    const result = await createUser.save();
    res.send(result);
  } catch (err) {
    next(err);
    console.log("Error Occured. Please Check Your Input Values " + err);
  }
};

exports.login = async function (req, res, next) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Invalid email");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(validPassword);
    if (!validPassword) return res.status(404).send("Invalid password");

    jwt.sign({ user }, process.env.SECRET_KEY, (err, token) => {
      res.json({
        user,
        token,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async function (req, res) {
  const oldPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const isUser = await User.findById({ _id: req._id });
  if (!isUser) return res.status(400).send("User does not exists");

  const validPassword = await bcrypt.compare(oldPassword, isUser.password);

  if (validPassword) {
    const password = await hashPassword(newPassword);
    const _id = isUser._id;
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } else {
    res.send("Current Password is incorrect ");
  }
};

exports.forgotPassword = async function (req, res, next) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Invalid email");
    const token = jwt.sign({ id: user._id.valueOf() }, process.env.SECRET_KEY, {
      expiresIn: "60m",
    });
    let receiverMail = "devcamper123@gmail.com";
    await mailSender(receiverMail, token);
    user.token = token;
    await user.save();

    res.send("Password Reset Link Sent To Email.\n Token=" + token);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.resetPassword = async function (req, res) {
  try {
    jwt.verify(
      req.body.token,
      process.env.SECRET_KEY,
      async (err, authData) => {
        if (err) {
          res.send(err);
        } else {
          let user = await User.findById({ _id: authData.id });
          if (!user) {
            res.send("User Does Not exists");
          }
          if (user.token != req.body.token) {
            res.send("Invalid Token");
          }
          let getPassword = await hashPassword(req.body.newPassword);

          if (getPassword == null || getPassword == undefined) {
            res.status(400).send("Please Enter A Valid Password");
          } else {
            user.password = getPassword;
            await user.save();
            res.send(user);
          }
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
};
