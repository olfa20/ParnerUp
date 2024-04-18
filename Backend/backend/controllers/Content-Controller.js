const Content = require("../models/Content");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/User");

exports.getContent = async (req, res, next) => {
  let contents;
  try {
    contents = await Content.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching categories failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    contents: contents.map((content) =>
      content.toObject({ getters: true })
    ),
  });
};

exports.getContentById = async (req, res, next) => {
  const contentId = req.params.id;
  let content;
  try {
    content = await Content.findById(contentId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!content) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ content: content.toObject({ getters: true }) });
};

exports.getContentByName = async (req, res, next) => {
  let str = req.params.name;
 
  let content;
  try {
    content = await Content.find({
      name: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!content) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ content: content });
};

exports.createContent = async (req, res, next) => {
  const { name } = req.body;

  let existingContent;
  try {
    existingContent = await Content.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating category failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingContent) {
    return next(new HttpError("category exists already", 422));
  }

  let createdContent = new Content({ name, users: [] });
  try {
    await createdContent.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating Category failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ content: createdContent });
};

exports.updateContent = async (req, res, next) => {
  const contentId = req.params.id;
  let upContent;

  try {
    upContent = await Content.findById(contentId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upContent) {
    const error = new HttpError(
      "Could not find abonnement for the provided id.",
      404
    );
    return next(error);
  }

  const { name } = req.body;

  if (name) upContent.name = name;

  try {
    await upContent.save();
  } catch (err) {
    const error = new HttpError(
      "updating abonnement failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ content: upContent });
};

exports.deleteContent = async (req, res, next) => {
  const contentId = req.params.id;
  let content;
  try {
    content = await Content.findById(contentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category..",
      500
    );
    return next(error);
  }

  if (!content) {
    const error = new HttpError("Could not find category for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    content.users.map(async (bk) => {
      let bd;
      try {
        bd = await User.findById(bk.toString());
        bd.content = null;
        await bd.save({ session: sess });
      } catch (err) {}
    });
    await content.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category.",
      500
    );
  }
  res.status(200).json({ message: "Deleted category." });
};

exports.countContent = async (req, res) => {
  try {
    const count = await Content.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
