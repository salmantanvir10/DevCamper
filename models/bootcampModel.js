const mongoose = require("mongoose");

const userModel = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  }, 
});

module.exports = mongoose.model("bootcamp", userModel);
