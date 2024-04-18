const mongoose = require("mongoose");
const Post = require("../models/Post");
const HttpError = require("../models/http-error");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");
const fs = require("fs");


exports.createPost = async (req, res) => {
  const {
    title,
    description,
    created_by,
    date,
    category,
    hashtags,
    created_by_type,
  } = req.body;
  let media;
  if (req.file && !!req.file.path) {
    media = req.file.path;
  }
  try {
    const post = new Post({
      title,
      description,
      category,
      hashtags,
      media,
      created_by,
      date,
      created_by_type,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// get posts for specific user
exports.getPosts = async (req, res, next) => {
  const influencerId = req.params.influencerId;
  let posts;
  try {
    posts = await Post.find({
      created_by: mongoose.Types.ObjectId(influencerId),
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
  }
};

exports.getPostById = async (req, res, next) => {
  const postId = req.params.id;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    console.log(error);
  }
  if (!post) {
    const error = new HttpError(
      "Could not find post for the provided id.",
      404
    );
    return next(error);
  }

  res.json(post);
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;

  let upPost;

  try {
    upPost = await Post.findById(postId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upPost) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const { description, title, hashtags, category, location } = req.body;

  if (description) upPost.description = description;

  if (title) upPost.title = title;
  if (hashtags) upPost.hashtags = hashtags;
  if (category) upPost.category = category;
  if (location) upPost.location = location;

  if (req.files && req.files.length > 0) {
    upPost.media = req.files.map((file) => file.path);
  }
  try {
    await upPost.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating Post failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ post: upPost });
};

//count post
exports.countPost = async (req, res) => {
  try {
    const count = await Post.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get all posts
exports.getAll = async (req, res, next) => {
  const userId = req.params.userId;
  let posts;
  try {
    posts = await Post.find({ created_by: { $ne: userId } })
      .populate("created_by", "fname lname company profileImage userType")
      .select("-__v") // Exclude the '__v' field from the results
      .sort({ date: -1 });
  } catch (err) {
    const error = new HttpError(
      "Fetching posts failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    posts: posts.map((post) => post.toObject({ getters: true })),
  });
};

