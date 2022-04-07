const mongoose = require("mongoose");
const coursesModel = new mongoose.Schema({
  courseID: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    // minlength:5,
    maxlength:100, 
    required: true  
  },
  creditHours:{
      type:Number,
      required:true
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'bootcamp',
    required: true
  }, 
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  }

});

module.exports = mongoose.model("coursesData", coursesModel);
