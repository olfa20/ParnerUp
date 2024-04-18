const mongoose = require("mongoose");

const favorisSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },

  title: { type: String },
  overview: { type: String }, // description
  price: { type: String },

  responsibilities: [{ type: String }],
  requirements: [{ type: String }], // quoi faire

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    type: String,
  },
  dateEvent: { type: String },
  media: [{ type: String }],
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: false,
  },
});

const Favoris = mongoose.model("Favoris", favorisSchema);

module.exports = Favoris;
