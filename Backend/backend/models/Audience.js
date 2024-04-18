const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const audienceSchema = new Schema({
  name: {
    type: String,
  },

  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Audience", audienceSchema);
