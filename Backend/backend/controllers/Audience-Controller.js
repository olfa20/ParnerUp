const Audience = require("../models/Audience");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/User");

exports.getAudiences = async (req, res, next) => {
  let audiences;
  try {
    audiences = await Audience.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching audiences failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    audiences: audiences.map((audience) =>
      audience.toObject({ getters: true })
    ),
  });
};

exports.getAudienceById = async (req, res, next) => {
  const audienceId = req.params.id;
  let audience;
  try {
    audience = await Audience.findById(audienceId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching audience failed, please try again later",
      500
    );
    return next(error);
  }

  if (!audience) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ audience: audience.toObject({ getters: true }) });
};

exports.getAudienceByName = async (req, res, next) => {
  let str = req.params.name;

  let audience;
  try {
    audience = await Audience.find({
      name: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!audience) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ audience: audience });
};

exports.createAudience = async (req, res, next) => {
  const { name } = req.body;

  let existingAudience;
  try {
    existingAudience = await Audience.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating audience failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingAudience) {
    return next(new HttpError("audience exists already", 422));
  }

  let createdAudience = new Audience({ name, users: [] });
  try {
    await createdAudience.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating audience failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ audience: createdAudience });
};

exports.updateAudience = async (req, res, next) => {
  const audienceId = req.params.id;
  let upAudience;

  try {
    upAudience = await Audience.findById(audienceId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upAudience) {
    const error = new HttpError(
      "Could not find audience for the provided id.",
      404
    );
    return next(error);
  }

  const { name } = req.body;

  if (name) upAudience.name = name;

  try {
    await upAudience.save();
  } catch (err) {
    const error = new HttpError(
      "updating audience failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ audience: upAudience });
};

exports.deleteAudience = async (req, res, next) => {
  const audienceId = req.params.id;
  let audience;
  try {
    audience = await Audience.findById(audienceId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete audience..",
      500
    );
    return next(error);
  }

  if (!audience) {
    const error = new HttpError("Could not find audience for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    audience.users.map(async (bk) => {
      let bd;
      try {
        bd = await User.findById(bk.toString());
        bd.audience = null;
        await bd.save({ session: sess });
      } catch (err) {}
    });
    await audience.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete audience.",
      500
    );
  }
  res.status(200).json({ message: "Deleted audience." });
};

exports.countAudience = async (req, res) => {
  try {
    const count = await Audience.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
