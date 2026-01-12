
const mongoose = require("mongoose");
exports.mongodb = async()=>{

  try
  {
    await mongoose.connect('mongodb://localhost:27017/ChatServiceDb',
      {
        useNewUrlParser:true,
        useUnifiedTopology:true

      }
    );

    console.log("mongodb connection successfull");

  }
  catch(err)
  {

    console.log("mongodb connenction failed");

  }

}