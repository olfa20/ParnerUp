const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  result: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
    default: "Yes",
  },
  numberYes: {
    type: Number,
    default: 0
  },
  numberNo: {
    type: Number,
    default: 0
  },
  reviewMessage: {
    type: String,
  },
  Date:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
