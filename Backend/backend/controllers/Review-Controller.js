const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const acceptedCondidat = require("../models/AcceptedCondidat");
const AcceptedCandidate = require("../models/AcceptedCondidat");
const Result = require("../models/Result");

exports.SendReview = async (req, res, next) => {
  const { companyId, influencerId, result, reviewMessage } = req.body;

  let acceptedCandidate;

  try {
    acceptedCandidate = await AcceptedCandidate.findOne({
      appowner: companyId,
      influencer: influencerId,
    });
  } catch (error) {
    console.log(error);
    const err = new HttpError("Could not find accepted candidate", 500);
    return next(err);
  }

  if (!acceptedCandidate) {
    const error = new HttpError(
      "You cannot add a review for this candidate",
      500
    );
    return next(error);
  }

  const review = new Review({
    company: companyId,
    influencer: influencerId,
    result: result,
    reviewMessage: reviewMessage,
  });

  if (result === "Yes") {
    review.numberYes += 1;
  } else if (result === "No") {
    review.numberNo += 1;
  }

  try {
    await review.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError("Creating review failed", 500);
    return next(err);
  }

  res.status(201).json({ review: review.toObject({ getters: true }) });
};

exports.getReviewByCompany = async (req, res, next) => {
  const companyId = req.params.id;
  let review;
  try {
    review = await Review.findOne({
      appowner: companyId,
    });
  } catch (error) {
    const err = new HttpError("Creating review failed", 500);
    return next(err);
  }
  res.status(201).json({ review: Review.toObject({ getters: true }) });
};

exports.getReviewByCompany = async (req, res, next) => {
  const companyId = req.params.id;
  let reviews;
  try {
    reviews = await Review.find({
      company: mongoose.Types.ObjectId(companyId),
    }).populate("influencer");

    res.json(reviews);
  } catch (error) {
    console.error(error);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).send("review not found");
    res.json({ message: "review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
exports.getReviewStats = async (req, res, next) => {
  const companyId = req.params.companyId;

  let reviews;
  try {
    reviews = await Review.find({ company: companyId });
  } catch (error) {
    console.log(error);
    const err = new HttpError("Fetching reviews failed", 500);
    return next(err);
  }

  let numYes = 0;
  let numNo = 0;
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    if (review.result === "Yes") {
      numYes += 1;
    } else if (review.result === "No") {
      numNo += 1;
    }
  }

  res.status(200).json({ numYes, numNo });
};

exports.countReview = async (req, res) => {
  try {
    const count = await Review.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


