const express = require("express");
const router = express.Router()
const app = express()
const bootcampController = require('../controllers/bootcamp.controller')
const {verifyToken} = require('../middleware/auth')
const coursesRoutes = require('../routes/courses')

//middlewares for logging data
router.use('/:id', (req, res, next) => {
  console.log('Request Type:', req.method +" and ID is "+req.params.id)
  next()
})
  router.use('/id/name/city',(req, res, next)=> {
    console.log("Request Type:",req.method +" and details are: "+JSON.stringify(req.body))
    next();
  }
  );
  router.use('/:id/city', (req, res, next)=> {
    console.log("Request Type:",req.method +" and details are: "+JSON.stringify(req.body))
    next();
  });
  router.use('/:userid', function(req, res, next) {
    console.log("Request Type:",req.method +" and details are: "+JSON.stringify(req.params))
    next();
  });


//crud endpoints 
router.get("/",verifyToken,bootcampController.index);
router.get("/:id",verifyToken,bootcampController.read);
router.post("/name/city", verifyToken,bootcampController.create);
router.put("/:id/city",verifyToken,bootcampController.update);
router.delete("/:id",verifyToken,bootcampController.delete);

module.exports = router
