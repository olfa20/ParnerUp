const mongoose = require("mongoose");

const CollaborationInfluencerSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

const CollaborationInfluencer = mongoose.model(
  "CollaborationInfluencer",
  CollaborationInfluencerSchema
);

module.exports = CollaborationInfluencer;
