const Reach = require("../models/Reach");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const User = require("../models/User");

exports.getReaches = async (req, res, next) => {
  let reaches;
  try {
    reaches = await Reach.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching audiences failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    reaches: reaches.map((reach) =>
    reach.toObject({ getters: true })
    ),
  });
};

exports.getReachById = async (req, res, next) => {
  const reachId = req.params.id;
  let reach;
  try {
    reach = await Reach.findById(reachId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching audience failed, please try again later",
      500
    );
    return next(error);
  }

  if (!reach) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ reach: reach.toObject({ getters: true }) });
};

exports.getReachByName = async (req, res, next) => {
  let str = req.params.name;

  let reach;
  try {
    reach = await Reach.find({
      name: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching reach failed, please try again later",
      500
    );
    return next(error);
  }

  if (!reach) {
    const error = new HttpError(
      "Could not find an reach with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ reach: reach });
};

exports.createReach = async (req, res, next) => {
  const { name } = req.body;

  let existingReach;
  try {
    existingReach = await Reach.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating audience failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingReach) {
    return next(new HttpError("audience exists already", 422));
  }

  let createdReach = new Reach({ name, users: [] });
  try {
    await createdReach.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating audience failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ reach: createdReach });
};

exports.updateReach = async (req, res, next) => {
  const reachId = req.params.id;
  let upReach;

  try {
    upReach = await Reach.findById(reachId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upReach) {
    const error = new HttpError(
      "Could not find audience for the provided id.",
      404
    );
    return next(error);
  }

  const { name } = req.body;

  if (name) upReach.name = name;

  try {
    await upReach.save();
  } catch (err) {
    const error = new HttpError(
      "updating audience failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ reach: upReach });
};

exports.deleteReach = async (req, res, next) => {
  const reachId = req.params.id;
  let reach;
  try {
    reach = await Reach.findById(reachId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete audience..",
      500
    );
    return next(error);
  }

  if (!reach) {
    const error = new HttpError("Could not find audience for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    reach.users.map(async (bk) => {
      let bd;
      try {
        bd = await User.findById(bk.toString());
        bd.reach = null;
        await bd.save({ session: sess });
      } catch (err) {}
    });
    await reach.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete audience.",
      500
    );
  }
  res.status(200).json({ message: "Deleted reach." });
};

exports.countReach = async (req, res) => {
  try {
    const count = await Reach.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
