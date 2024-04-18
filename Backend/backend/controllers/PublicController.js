const Public = require("../models/Public");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/User");

exports.getPublics = async (req, res, next) => {
  let publics;
  try {
    publics = await Public.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching publics failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    publics: publics.map((public) =>
    public.toObject({ getters: true })
    ),
  });
};

exports.getPublicById = async (req, res, next) => {
  const publicId = req.params.id;
  let public;
  try {
    public = await Public.findById(publicId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching public failed, please try again later",
      500
    );
    return next(error);
  }

  if (!public) {
    const error = new HttpError(
      "Could not find an public with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ public: public.toObject({ getters: true }) });
};

exports.getPublicByName = async (req, res, next) => {
  let str = req.params.name;
 
  let public;
  try {
    public = await Public.find({
      name: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching public failed, please try again later",
      500
    );
    return next(error);
  }

  if (!public) {
    const error = new HttpError(
      "Could not find an public with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ public: public });
};

exports.createPublic = async (req, res, next) => {
  const { name } = req.body;

  let existingPublic;
  try {
    existingPublic = await Public.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating Public failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingPublic) {
    return next(new HttpError("public exists already", 422));
  }

  let createdPublic = new Public({ name, users: [] });
  try {
    await createdPublic.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating Category failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ public: createdPublic });
};

exports.updatePublic = async (req, res, next) => {
  const publicId = req.params.id;
  let upPublic;

  try {
    upPublic = await Public.findById(publicId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upPublic) {
    const error = new HttpError(
      "Could not find public for the provided id.",
      404
    );
    return next(error);
  }

  const { name } = req.body;

  if (name) upPublic.name = name;

  try {
    await upPublic.save();
  } catch (err) {
    const error = new HttpError(
      "updating public failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ public: upPublic });
};

exports.deletePublic = async (req, res, next) => {
  const publicId = req.params.id;
  let public;
  try {
    public = await Public.findById(publicId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete public..",
      500
    );
    return next(error);
  }

  if (!public) {
    const error = new HttpError("Could not find public for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    public.users.map(async (bk) => {
      let bd;
      try {
        bd = await User.findById(bk.toString());
        bd.public = null;
        await bd.save({ session: sess });
      } catch (err) {}
    });
    await public.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete public.",
      500
    );
  }
  res.status(200).json({ message: "Deleted public." });
};

exports.countPublic = async (req, res) => {
  try {
    const count = await Public.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
