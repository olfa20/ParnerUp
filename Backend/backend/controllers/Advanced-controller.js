const mongoose = require("mongoose");
const Advanced = require("../models/Advanced");
const HttpError = require("../models/http-error");

exports.CreateAdvanced = async (req, res, next) => {
  const { description, title, userType } = req.body;

  let advanced;

  if (userType === "Influencer") {
    advanced = new Advanced({
      title: title,
      description: description,
      userType: userType,
    });
  } else if (userType === "Appowner") {
    advanced = new Advanced({
      title: title,
      description: description,
      userType: userType,
    });
  }

  try {
    const createdAdvanced = await advanced.save();
    res.status(201).json({ advanced: createdAdvanced });
  } catch (err) {
    res.status(500).json({ message: "Failed to create advanced", error: err });
  }
};

exports.getAdvancedById = async (req, res, next) => {
  const advancedId = req.params.id;
  let advanced;
  try {
    advanced = await Advanced.findById(advancedId);
  } catch (error) {
    console.log(error);
  }
  if (!advanced) {
    const error = new HttpError(
      "Could not find advanced for the provided id.",
      404
    );
    return next(error);
  }

  res.json(advanced);
};

exports.updateAdvanced = async (req, res, next) => {
  const advancedId = req.params.advancedId;
  console.log(advancedId);
  let upAdvanced;

  try {
    upAdvanced = await Advanced.findById(advancedId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upAdvanced) {
    const error = new HttpError(
      "Could not find advanced for the provided id.",
      404
    );
    return next(error);
  }

  const { title, description, userType } = req.body;

  if (title) upAdvanced.title = title;
  if (description) upAdvanced.description = description;
  if (userType) upAdvanced.userType = userType;

  try {
    await upAdvanced.save();
  } catch (err) {
    const error = new HttpError(
      "updating advanced failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ advanced: upAdvanced });
};

exports.deleteAdvanced = async (req, res) => {
  try {
    const advanced = await Advanced.findByIdAndDelete(req.params.id);
    if (!advanced) return res.status(404).send("advanced not found");
    res.json({ message: "advanced deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getAdvanceds = async (req, res, next) => {
  let advanceds;
  try {
    advanceds = await Advanced.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching advanceds failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    advanceds: advanceds.map((advanced) =>
      advanced.toObject({ getters: true })
    ),
  });
};

exports.getAdvancedByuserType = async (req, res, next) => {
  const userType = req.params.userType;
  let advanced;

  if (userType === "influencer") {
    advanced = await Advanced.find({ userType: "Influencer" });
  } else if (userType === "appowner") {
    advanced = await Advanced.find({ userType: "Appowner" });
  }

  res.json(advanced);
};

exports.countAdvanced = async (req, res) => {
  try {
    const count = await Advanced.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAdvancedByTitle = async (req, res, next) => {
  let str = req.params.title;

  let advanced;
  try {
    advanced = await Advanced.find({
      title: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!advanced) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ advanced: advanced });
};

exports.getAdvancedByTitleAndType = async (req, res, next) => {
  try {
    const { title, userType } = req.params;

    let advanced;

    if (userType === "influencer") {
      advanced = await Advanced.find({
        title: { $regex: title, $options: "i" },
        userType: "Influencer",
      });
    } else if (userType === "appowner") {
      advanced = await Advanced.find({
        title: { $regex: title, $options: "i" },
        userType: "Appowner",
      });
    }

    if (!advanced || advanced.length === 0) {
      throw new Error(
        "Could not find an advanced with the provided title and user type."
      );
    }

    res.status(200).json({ advanced });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
};
