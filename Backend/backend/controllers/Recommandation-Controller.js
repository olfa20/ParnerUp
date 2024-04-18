const User = require("../models/User");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Recommendation = require("../models/Recommondation");

exports.getAllRecommendation = async (req, res, next) => {
  let Recommendations;
  try {
    Recommendations = await Recommendation.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    Recommendations: Recommendations.map((Recommendation) =>
      Recommendation.toObject({ getters: true })
    ),
  });
};

exports.CreateRecommandation = async (req, res, next) => {
  let influencers;
  try {
    influencers = await User.find({ userType: "influencer" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not fetch influencers." });
  }

  if (!influencers) {
    return res.status(404).json({ message: "Influencers not found." });
  }

  const recommendations = [];

  for (const influencer of influencers) {
    try {
      if (influencer.numberOfCollaborations > 3) {
        recommendations.push(influencer);
      }
    } catch (error) {
      console.log(error);
      continue;
    }
  }

  return res.json({ recommendations });
};
