const express = require("express");
const router = express.Router()
const coursesController  = require('../controllers/courses.controller')
const {verifyToken} = require('../middleware/auth')


router.get("/:id/courses" ,verifyToken ,coursesController.index );
router.get("/:id/courses/:courseId",verifyToken,coursesController.read)
router.post("/:id/courses",verifyToken,coursesController.create)
router.put("/:id/courses/:courseId",verifyToken,coursesController.update)
router.delete("/:id/courses/:courseId",verifyToken ,coursesController.delete)

module.exports = router;
