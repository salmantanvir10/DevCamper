const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


const User = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true
  },
  token:{
    type:String,
    required:false
  }
});

module.exports = mongoose.model("user", User);