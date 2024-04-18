const mongoose = require("mongoose");
const noteschema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    // default: Date.now,
  },
  categoryNote: { type: mongoose.Types.ObjectId, ref: "CategoryNote" },
});

module.exports = mongoose.model("Note", noteschema);
