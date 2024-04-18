const User = require("../models/User");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const HttpError = require("../models/http-error");

// create Comment
exports.comment = async (req, res) => {
  const userId = req.params.userId;

  const { comment, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      comment: comment,
      fname: user.fname,
      lname: user.lname,
      image: user.profileImage,
    });

    await newComment.save();

    // Create a notification for the user
    const notification = new Notification({
      sender: userId,
      receiver: post.created_by,
      message: `${user.fname} ${user.lname} comment your post "${post.title}".`,
      post: postId,
      image: user.profileImage,
      userType:user.userType
    });
    await notification.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error applying to job:", err);
    res
      .status(500)
      .json({ message: "An error occurred while comment the post." });
  }
};

//get notification

exports.getNotification = async (req, res) => {
  const { userId } = req.params;
  const notifs = await Notification.find({
    receiver: new mongoose.Types.ObjectId(userId),
    viewed: false,
  }).sort({ createdAt: -1 }); // sort notifications by descending order of creation date
  res.status(200).json(notifs);
};

//get comments
exports.getComments = async (req, res, next) => {
  const postId = req.params.postId;

  let comments;
  try {
    comments = await Comment.find({ post: postId });
  } catch (err) {
    const error = new HttpError(
      "Fetching comments failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    comment: comments.map((comment) => comment.toObject({ getters: true })),
  });
};

//edit comment

exports.updateComment = async (req, res, next) => {
  const commentId = req.params.commentId;

  let upComment;

  try {
    upComment = await Comment.findById(commentId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upComment) {
    const error = new HttpError(
      "Could not find comment for the provided id.",
      404
    );
    return next(error);
  }

  const { comment } = req.body;

  if (comment) upComment.comment = comment;

  try {
    await upComment.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "updating Comment failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ comment: upComment });
};

//delete Comment

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).send("Comment not found");
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// getcommentByid

exports.getCommentById = async (req, res, next) => {
  const commentId = req.params.id;
  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (error) {
    console.log(error);
  }
  if (!comment) {
    const error = new HttpError(
      "Could not find comment for the provided id.",
      404
    );
    return next(error);
  }
  res.json(comment);
};

//count the number of comments

exports.count = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Compter les commentaires pour ce post
    const commentCount = await Comment.countDocuments({ post: postId });

    res.status(200).json({ commentCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// count noftification
exports.countNotfication = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await Notification.countDocuments({
      receiver: new mongoose.Types.ObjectId(userId),
      viewed: false
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//update notification

exports.updateNotification  = async(req,res,next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { viewed: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.countComments = async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
