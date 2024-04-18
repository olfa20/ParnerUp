const mongoose = require("mongoose");

const RecommandationSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  numberOfCollaborations: {
    type: Number,
    default: 0,
  },
});

const Events = mongoose.model("Recommandation", RecommandationSchema);

module.exports = Events;
