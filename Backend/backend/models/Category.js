const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
  },

  offers: [{ type: mongoose.Types.ObjectId, ref: "Offer" }],
});

module.exports = mongoose.model("Category", categorySchema);