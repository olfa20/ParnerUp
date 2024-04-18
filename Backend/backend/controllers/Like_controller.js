const User = require("../models/User");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const Like = require("../models/Like");
const HttpError = require("../models/http-error");

exports.createLikes = async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  let post;

  try {
    post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // If the user has already liked the post, then remove the existing like
      await Like.findByIdAndDelete(existingLike._id);
      res.status(200).json({ message: "Like removed." });
    } else {
      // If the user has not already liked the post, then add a new like
      const newLike = new Like({
        user: userId,
        post: postId,
        fname: user.fname,
        lname: user.lname,
        image: user.profileImage,
      });

      await newLike.save();

      if (userId.toString() === post.created_by.toString()) {
        // If the user is the creator of the post, don't send a notification but still return the new like
        return res.status(201).json(newLike);
      }
      const notificationMessage =
        user.userType === "influencer"
          ? `${user.fname} ${user.lname} like your post "${post.title}".`
          : `${user.company} like your post "${post.title}".`;

      const notification = new Notification({
        sender: userId,
        receiver: post.created_by,
        message: notificationMessage,
        post: postId,
        image: user.profileImage,
        userType: user.userType,
      });

      await notification.save();
      res.status(201).json(newLike);
    }
  } catch (err) {
    console.error("Error liking the post:", err);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post." });
  }
};

//get likes

exports.getLikes = async (req, res, next) => {
  const postId = req.params.postId;

  let likes;
  try {
    likes = await Like.find({ post: postId });
  } catch (err) {
    const error = new HttpError(
      "Fetching like failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    like: likes.map((like) => like.toObject({ getters: true })),
  });
};

//count likes

exports.count = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const likeCount = await Like.countDocuments({ post: postId });
    res.status(200).json({ likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.countLikes = async (req, res) => {
  try {
    const count = await Like.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
