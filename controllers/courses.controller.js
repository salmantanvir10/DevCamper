const courses = require("../models/CoursesModel");
const bootcamp = require("../models/bootcampModel");
const express = require("express");
const { customMiddleware } = require("../middleware/customMiddleware");


//endpoints

exports.index = async function (req, res, next) {

 let pathToPopulate = "bootcamp"     //this is path for populate method
  let result = await customMiddleware(       
    courses,
    { bootcamp: req.params.id },
    { creditHours: req.query.sortBy },
    req.query,
    pathToPopulate,next
    
  );

  res.send(result);
};

exports.read = async function (req, res, next) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, courseID: req.params.courseId })
    .populate({ path: "bootcamp", options: { strictPopulate: false } })
    .clone()
    .catch(next);
  if (getUser == undefined || getUser == null) {
    return next("user not found");
  } else {
    res.send(getUser);
  }
};

exports.create = async function (req, res, next) {
  try {
    let userCourses = new courses({
      courseID: req.body.courseID,
      teacherName: req.body.teacherName,
      creditHours: req.body.creditHours,
      bootcamp: req.params.id,
      user: req._id
    });
    const findUser = await bootcamp.findById(req.params.id);
    if (findUser == null || findUser == undefined) {
      res.send("User Not Found");
    } else {
      const result = await userCourses.save();
      res.send(result);
    }
  } catch (err) {
    next(err);
    console.log("Error Occured. Please Check Your Input Values " + err);
  }
};
//update
exports.update = async function (req, res, next) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, _id: req.params.courseId })
    .clone()
    .catch(next);
    console.log("===> "+getUser);
    if (getUser.user.valueOf()!== req._id){
      console.log("User not validated..");
       return next("User Not Validated")
    }


  if (getUser == undefined || getUser == null) {
    return next("User not found");
  } else {
    courses
      .findOneAndUpdate(
        { bootcamp: req.params.id },
        { $set: { courseID: req.body.courseId } },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
            return next(err);
          } else {
            res.send("CourseID Updated");
          }
        }
      )
      .clone()
      .catch(next);
  }
};

exports.delete = async function (req, res, next) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, courseID: req.params.courseId })
    .clone()
    .catch(next);

    if (getUser.user.valueOf() !== req._id){
      console.log("User not validated");
       return next("User Not Validated")
    }
  if (getUser == undefined || getUser == null) {
    return next("User not found");
  } else {
    courses
      .deleteOne(
        { bootcamp: req.params.id, courseID: req.params.courseId },
        function (err, obj) {
          if (err) {
            console.log("Error while deleting user");
            return next();
          } else {
            res.send("Course deleted");
          }
        }
      )
      .clone()
      .catch(next);
  }
};
