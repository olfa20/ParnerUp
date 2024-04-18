const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },

  media: [{ type: String }],

  // photos et images
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_by_type: {
    type: String,
    enum: ["influencer", "appowner"],
  },
  category: { type: String },
  hashtags: { type: String },
  location: { type: String },

  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: false,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      numberOfLikes: {
        type: Number,
        default: 0,
        required: false,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
