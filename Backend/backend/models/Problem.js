const mongoose = require("mongoose");
const problemSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fname: {
   type:String,
    ref: "User",
  },
  company: {
    type:String,
     ref: "User",
   },
  userType:{
    type:String
  },

  lname: {
    type:String,
    ref: "User",
  },
  email: {
    type: String,
    ref: "User",
  },
  receiver: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
,  
  message: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  media:{
    type:String
  },
  phone: { type: String },
});

module.exports = mongoose.model("Problem", problemSchema);
