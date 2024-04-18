const { required } = require("joi");
const mongoose = require("mongoose");

const socialMediaAccountSchema = new mongoose.Schema({
  instagramUrl: {
    type: String,
    required: false,
    url: true, // add this line to validate the URL format
  },
  twitterUrl: {
    type: String,
    required: false,
    url: true
  },
  facebookUrl: {
    type: String,
    required: false,
    url: true
  },
  youtubeUrl: {
    type: String,
    required: false,
    url: true
  },
  tiktokUrl: {
    type: String,
    required: false,
    url: true
  },
  linkedinUrl: {
    type: String,
    required: false,
    url: true
  },
  all :{
    type:String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,

  },
});

const SocialMediaAccount = mongoose.model(
  "SocialMediaAccount",
  socialMediaAccountSchema
);

module.exports = SocialMediaAccount;
