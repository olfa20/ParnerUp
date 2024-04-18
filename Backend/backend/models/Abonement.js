const mongoose = require("mongoose");

const AbonnementSchema = new mongoose.Schema({
  title: { type: String },
  services: [{ type: String }],

  media: [{ type: String }],

  price: { type: Number },
  duration: { type: String, match: /^\d+ days$/ },
  paymentMethod: { type: String },

  date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  paymentAmount: {
    type: Number,
    default: 0,
  },
  numberOfSubscribers:{
    type: Number,
    default: 0
  }
});

const Abonnement = mongoose.model("Abonnement", AbonnementSchema);

module.exports = Abonnement;
