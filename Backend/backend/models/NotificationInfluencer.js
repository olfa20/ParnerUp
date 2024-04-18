const mongoose = require("mongoose");

const influencerNotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    type: {
      type: String,
      enum: ["APPLICATION", "RESPONSE"],
      required: true,
    },
    image: {
      type: String,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const InfluencerNotification = mongoose.model(
  "InfluencerNotification",
  influencerNotificationSchema
);
module.exports = InfluencerNotification;
