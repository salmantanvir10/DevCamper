const express = require('express')
const app  = express();
const port =3000;
const connection  = require('./database/databaseConnection')
const generalRoute= require('./routes/generalRoutes')

app.use(express.json())

// Set up mongoose connection
connection();
//routes

app.use('/',generalRoute)


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
