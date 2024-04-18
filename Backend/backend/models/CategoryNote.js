const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categoryNoteSchema = new Schema({
  name: {
    type: String,
  },

  notes: [{ type: mongoose.Types.ObjectId, ref: "Note" }],
});

module.exports = mongoose.model("CategoryNote", categoryNoteSchema);