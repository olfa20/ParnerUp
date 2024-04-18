const mongoose = require("mongoose");
const AdvancedSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Influencer", "Appowner"],
  },
});

module.exports = mongoose.model("Advanced", AdvancedSchema);
