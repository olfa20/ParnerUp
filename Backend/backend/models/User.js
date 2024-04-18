const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  company: { type: String, require: true },
  location: { type: String },
  link: { type: String },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  phone: { type: String },
  city: { type: String },
  country: { type: String },
  description: { type: String },
  couvertureImage: { type: String },
  postDescription: { type: String },
  profileImage: { type: String },
  category: { type: String },
  // audience: { type: String },
  // audienceAges: { type: String },
  gain: { type: String },
  postcode: { type: String },
  content: { type: mongoose.Types.ObjectId, ref: "Content" },
  public: { type: mongoose.Types.ObjectId, ref: "Public" },
  audienceAge: { type: mongoose.Types.ObjectId, ref: "Audience" },
  numberOfCollaborations: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password! Passwords must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
  },
  verified: { type: Boolean, default: false },
  active: {
    type: Boolean,
    default: true, // By default, user accounts are enabled
  },
  name: { type: Boolean },
  userType: {
    type: String,
    required: true,
    enum: ["influencer", "appowner", "admin", "superadmin"],
    default: "influencer",
  },
  applications: [
    {
      abonnement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Abonnement",
        required: false,
      },
      subscribedAt: {
        type: Date,
        required: false,
      },
      validUntil: {
        type: Date,
        required: false,
      },
      services: [{ type: String }],
    },
  ],
});
// Reference to subscription schema

module.exports = mongoose.model("User", userSchema);
