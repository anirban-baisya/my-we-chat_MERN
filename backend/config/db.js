//it is responsible to connecting our Mongo database

const mongoose = require("mongoose");
const colors = require("colors");


const connectDB = async () => { //func. to connect dbs
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useFindAndModify: true,
    }); //{ } and 2nd thing is it takes few options

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;