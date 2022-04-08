const courses = require("../models/CoursesModel");
const bootcamp = require("../models/bootcampModel");
const { customMiddleware } = require("../middleware/customMiddleware");
const errorHandling = require('../middleware/errorHandling')

//endpoint functions

exports.index = errorHandling( async function (req, res, next) {
  let pathToPopulate = "bootcamp"; //this is path for populate method
  let result = await customMiddleware(
    courses,
    { bootcamp: req.params.id },
    { creditHours: req.query.sortBy },
    req.query,
    pathToPopulate,
    next
  );

  res.send(result);
})

exports.read = errorHandling( async function (req, res) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, courseID: req.params.courseId })
    .populate({ path: "bootcamp", options: { strictPopulate: false } })
  if (getUser == undefined || getUser == null) {
    return res.send("user not found");
  } else {
    res.send(getUser);
  }
});

exports.create = errorHandling( async function (req, res) {
    let userCourses = new courses({
      courseID: req.body.courseID,
      teacherName: req.body.teacherName,
      creditHours: req.body.creditHours,
      bootcamp: req.params.id,
      user: req._id,
    });
    const findUser = await bootcamp.findById(req.params.id);
    if (findUser == null || findUser == undefined) {
      res.send("User Not Found");
    } else {
      const result = await userCourses.save();
      res.send(result);
    }

});
//update
exports.update = errorHandling( async function (req, res) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, _id: req.params.courseId })
  console.log("===> " + getUser);

  if (getUser == undefined || getUser == null) {
    return res.send("Course not found");
  } else if (getUser.user.valueOf() !== req._id) {
    console.log("User not validated..");
    return res.send("User Not Validated");
  } else {
    courses
      .findOneAndUpdate(
        { bootcamp: req.params.id },
        { $set: { courseID: req.body.courseId } },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
            return res.send(err);
          } else {
            res.send("CourseID Updated");
          }
        }
      )
  }
});

exports.delete = errorHandling( async function (req, res) {
  const getUser = await courses
    .findOne({ bootcamp: req.params.id, _id: req.params.courseId })
  if (getUser == undefined || getUser == null) {
    return res.send("User not found");
  } 
  else if (getUser.user.valueOf() !== req._id) {
    return res.send("User Not Validated");
  } else {
    courses
      .deleteOne(
        { bootcamp: req.params.id, _id: req.params.courseId },
        function (err, obj) {
          if (err) {
            console.log("Error while deleting user");
            return 
          } else {
            res.send("Course deleted");
          }
        }
      )
  }
});
