const express = require('express');
const bootcampRoutes = require('./bootcamp');
const router = express.Router();
const coursesRoutes = require('../routes/courses')
const authentication = require('../routes/authentication')

router.use("/api/auth/", authentication);

router.use("/api/bootcamp", bootcampRoutes);
router.use("/api/bootcamps", coursesRoutes);


router.get("*", (req,res) =>{ 
     res.status(404).send("Invalid Path");
});

module.exports  = router;