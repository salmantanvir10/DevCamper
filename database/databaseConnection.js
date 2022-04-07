const mongoose = require("mongoose");

const connection = async () => {
    var db;
  try {    
    let dev_db_url =
      "mongodb+srv://salmantanvir666:herewego666@cluster.lcvxo.mongodb.net/DevCamper?retryWrites=true&w=majority";
    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    mongoose.connect(mongoDB);
    mongoose.Promise = global.Promise;
    db = mongoose.connection;
  } catch (exp) {
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    console.log("Cannot establish connection with database");
  }
};

module.exports = connection;
