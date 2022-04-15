const express = require('express')
const app  = express();
const port =3000;
const connection  = require('./database/databaseConnection')
const generalRoute= require('./routes/generalRoutes')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const  xss = require("xss-clean")
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const cors = require("cors")
app.use(express.json())

// Set up mongoose connection
connection();

app.use(bodyParser.urlencoded({ extended: true }));

//for preventing Sql-Injections
app.use(mongoSanitize());
//setting http headers
app.use(helmet())
//for preventing cross site scripting attacks
app.use(xss()) 
//preventing HTTP param pollution 
app.use(hpp());

 //adding time limit for number of requests
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100,
    message: 'You have reached maximum request limit.Try again later'
});
app.use(limiter);

//making apis public by enabling cors
app.use(cors())

//routes
app.use('/',generalRoute)


//global error handling middleware
app.use(function(error, req, res, next) {
    console.log("Error Handling Middleware: "+error.name)   

    if(error.name == "CastError"){
     res.send("Error 404. We ran into a problem. Can you check your input values.")
    }
    else if(error.name == "JsonWebTokenError"){
      res.status(401).send("Forbidden")
    }
    else{
    res.status(500).send("Error 500 object not found")
    }  
  })

app.listen(port,()=>{
    console.log("Listening now")
})
