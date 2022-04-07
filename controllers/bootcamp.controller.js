const userSchema = require("../models/bootcampModel");
const {customMiddleware} = require('../middleware/customMiddleware')



//functions to respond bootcamp endpoints
exports.index = async function(req,res,next){
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
}

exports.read = async function (req, res,next) {
  const getUser = await userSchema.findOne({ _id: req.params.id }).clone().catch(next);
    if(getUser==undefined ||getUser==null){
     return next("user not found");   
    }else{
    res.send(getUser);
    }
  
};
  
exports.create = async function (req, res,next) {
  let users = new userSchema({
    name: req.body.name,
    city: req.body.city,
    user: req._id
  });
  try {  
    const result = await users.save();
    res.send(result);

  } catch (err) {
    next(err);
    console.log("Error Occured. Please Check Your Input Values "+err );
  }
}
exports.update = async function (req, res,next) {
 
  const getUser = await userSchema.findOne({ _id: req.params.id }).clone().catch(next);
  if (getUser.user.valueOf()!== req._id){
    console.log("User not validated");
     return next("User Not Validated")
  }
  if(getUser==undefined ||getUser==null){
   return next("User not found");   
  }
  
  else{
    userSchema.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { city: req.body.city } },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
          return next(err);   
        } else {
          res.send("City Updated");
        }
      }
    ).clone().catch(next)
  }

};

exports.delete = async function (req, res,next) {

  const getUser = await userSchema.findOne({ _id: req.params.id }).clone().catch(next);

  if (getUser.user.valueOf()!== req._id){
    console.log("User not validated for deleting");
     return next("User not validated")
  }
  if(getUser==undefined ||getUser==null){
   return next("User not found");   
  }

  else{
    userSchema.deleteOne({ _id: req.params.id }, function (err, obj) {
      if (err){
         console.log("Error while deleting bootcamp")
         return next()
      }
      else{
      res.send("Bootcamp deleted");
      }
      
    }).clone().catch(next);
  }

}
