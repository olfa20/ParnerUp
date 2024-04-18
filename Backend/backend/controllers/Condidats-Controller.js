const User = require("../models/User");
const mongoose = require("mongoose");
const CondidatsAccepted = require("../models/AcceptedCondidat");
const AcceptedCandidate = require("../models/AcceptedCondidat");
const HttpError = require("../models/http-error");
const Offer = require("../models/OfferJob");

exports.getCondidatsAccepted = async (req, res, next) => {
  const appownerId = req.params.appownerId;
  let condidats;
  try {
    condidats = await CondidatsAccepted.find({
      appowner: mongoose.Types.ObjectId(appownerId),
    })
      .populate("influencer")
      .populate("job");
    res.json(condidats);
    console.log(condidats)
  } catch (error) {
    console.error(error);
  }
};

exports.deleteCondidat = async (req, res) => {
  try {
    const condidat = await CondidatsAccepted.findByIdAndDelete(req.params.id);
    if (!condidat) return res.status(404).send("Condidat not found");
    res.json({ message: "Condidat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getCondidatByTitle = async (req, res, next) => {
  const title = req.params.title;

  let jobs;

  try {
    jobs = await Offer.find({ title: { $regex: title, $options: "i" } });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching jobs failed, please try again later",
      500
    );
    return next(error);
  }

  let condidat;

  try {
    const jobIds = jobs.map((job) => job._id); // extract the _id of each job
    condidat = await AcceptedCandidate.find({
      job: { $in: jobIds }, // query for accepted candidates whose job is included in the extracted _id array
    }).populate("influencer appowner job");
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching candidates failed, please try again later",
      500
    );
    return next(error);
  }

  if (!condidat || condidat.length === 0) {
    const error = new HttpError(
      "Could not find any candidate with the provided title",
      404
    );
    return next(error);
  }

  res.json({ condidat: condidat });
};

exports.count = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await AcceptedCandidate.countDocuments({ appowner: userId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatestatus = async (req, res, next) => {
  const candidatId = req.params.condidatId;

  let candidat;

  try {
    candidat = await AcceptedCandidate.findById(candidatId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching candidat failed, please try again later",
      500
    );
    return next(error);
  }

  candidat.status = "completed";

  try {
    await candidat.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Updating status failed, please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({
    candidat: candidat.toObject({ getters: true }),
    message: "Status updated successfully!",
  });
};

exports.calculateStatus = async (req, res, next) => {
  const appownerId = req.params.id;

  let candidates;
  try {
    candidates = await CondidatsAccepted.find({ appowner: appownerId });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching candidates failed, please try again later",
      500
    );
    return next(error);
  }

  let progress = 0;
  let completed = 0;

  candidates.forEach((candidate) => {
    if (candidate.status === "In progress") {
      progress++;
    } else if (candidate.status === "completed") {
      completed++;
    }
  });

  res.json({ progress, completed });
};
