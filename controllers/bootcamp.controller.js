const userSchema = require("../models/bootcampModel");
const {customMiddleware} = require('../middleware/customMiddleware')
const errorHandling = require('../middleware/errorHandling')



//functions to respond bootcamp endpoints
exports.index = errorHandling(  async function(req,res,next){
  let pathToPopulate="";

  let result = await customMiddleware(
    userSchema,
    {},                  //sending empty because no criteria needed and we want all documents
    { name: req.query.sortBy },
    req.query,
    pathToPopulate,
    next
  );

  res.send(result);
})

exports.read = errorHandling( async function (req, res) {
  const getUser = await userSchema.findOne({ _id: req.params.id });
    if(getUser==undefined ||getUser==null){
     return res.send("user not found");   
    }else{
    res.send(getUser);
    }
  
});
  
exports.create = errorHandling( async function (req, res) {
  let users = new userSchema({
    name: req.body.name,
    city: req.body.city,
    user: req._id
  }); 
    const result = await users.save();
    res.send(result); 
})

exports.update = errorHandling( async function (req, res) {
 
  const getUser = await userSchema.findOne({ _id: req.params.id });
  if (getUser.user.valueOf()!== req._id){
    console.log("User not validated");
     return res.send("User Not Validated")
  }
  if(getUser==undefined ||getUser==null){
   return req.send("User not found");   
  }
  
  else{
    userSchema.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { city: req.body.city } },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
          return res.send(err);   
        } else {
          res.send("City Updated");
        }
      }
    )
  }

});

exports.delete = errorHandling( async function (req, res) {
  const getUser = await userSchema.findOne({ _id: req.params.id });

  if (getUser.user.valueOf()!== req._id){
    console.log("User not validated for deleting");
     return res.send("User not validated")
  }
  if(getUser==undefined ||getUser==null){
   return res.send("User not found");   
  }

  else{
    userSchema.deleteOne({ _id: req.params.id }, function (err, obj) {
      if (err){
         console.log("Error while deleting bootcamp")
         return res.send("Error while deleting")
      }
      else{
      res.send("Bootcamp deleted");
      }
      
    })
  }

})
