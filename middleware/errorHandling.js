// for removing excessive use of try and catch blocks
module.exports = function (func){ 
    return async (req, res, next) => {
      try{
        await func(req, res);
      }
      catch(err){
        next(err);
      }
    };
  };