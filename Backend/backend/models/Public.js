const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const publicSchema = new Schema({
  name: {
    type: String,
  },

  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Public", publicSchema); 