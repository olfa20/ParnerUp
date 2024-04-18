const mongoose = require("mongoose");
const ResultSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  numberYes: {
    type: Number,
    default: 0,
  },
  numberNo: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Result", ResultSchema);
