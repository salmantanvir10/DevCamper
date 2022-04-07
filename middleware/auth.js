const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require('dotenv').config();
app.use(express.json());

exports.verifyToken = async function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        next(err);
      } else {
        req._id = authData.user._id;
      }
    });

    // Next middleware
    next();
  } else {
    // Forbidden
    res.status(401).send("Unauthorized Access");
  }
};
