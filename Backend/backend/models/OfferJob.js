const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String },
  overview: { type: String }, // description
  price: { type: Number },

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
  category: { type: mongoose.Types.ObjectId, ref: "Category" },

  applications: [
    {
      influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        required: false,
      },
      message: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["APPLIED", "ACCEPTED", "REFUSED"],
        default: "APPLIED",
      },
      response: {
        type: String,
        enum: ["APPLIED", "ACCEPTED", "REFUSED"],
      },
    },
  ],
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

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
