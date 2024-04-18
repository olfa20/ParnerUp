const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  phone: { type: String },
  city: { type: String },
  country: { type: String },
  profileImage: { type: String },
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
});

module.exports = mongoose.model("Admin", userSchema);
