const mongoose = require("mongoose");

const acceptedCandidateSchema = new mongoose.Schema({
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
  acceptedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["In progress", "completed"],
    default: "In progress",
  },
});

const AcceptedCandidate = mongoose.model(
  "AcceptedCandidate",
  acceptedCandidateSchema
);

module.exports = AcceptedCandidate;
