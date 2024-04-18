const mongoose = require("mongoose");
const Offer = require("../models/OfferJob");
const Favoris = require("../models/Favoris");
const HttpError = require("../models/http-error");

exports.CreateFavoris = async (req, res, next) => {
  const offerId = req.params.offerId;
  const influencerId = req.params.influencerId;

  let offer;
  try {
    offer = await Offer.findById(offerId);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not find offer for the provided id.", 404)
    );
  }

  if (!offer) {
    const error = new HttpError(
      "Could not find offer for the provided id.",
      404
    );
    return next(error);
  }

  let existingFavoris;
  try {
    existingFavoris = await Favoris.findOne({
      influencer: influencerId,
      job: offerId,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Could not check for existing favoris, please try again.",
        500
      )
    );
  }

  let isAddedToFavorites;
  if (existingFavoris) {
    await Favoris.findByIdAndDelete(existingFavoris._id);
    isAddedToFavorites = false;
  } else {
    const favoris = {
      job: offerId,
      influencer: influencerId,
      title: offer.title,
      overview: offer.overview,
      price: offer.price,
      responsibilities: offer.responsibilities,
      requirements: offer.requirements,
      created_by: offer.created_by,
      address: offer.address,
      dateEvent: offer.dateEvent,
      media: offer.media,
      date: offer.date,
    };

    try {
      await Favoris.create(favoris);
      isAddedToFavorites = true;
    } catch (error) {
      console.log(error);
      return next(
        new HttpError("Could not create favoris, please try again.", 500)
      );
    }
  }

  res.status(200).json({
    isAddedToFavorites,
  });
};


exports.getFavoris = async (req, res, next) => {
  const influencerId = req.params.influencerId;

  let favoris;
  try {
    favoris = await Favoris.find({
      influencer: new mongoose.Types.ObjectId(influencerId),
    });
    res.json(favoris);
  } catch (error) {
    return next(
      new HttpError("Could not find favoris for the provided id.", 404)
    );
  }
};

exports.deleteFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.findByIdAndDelete(req.params.id);
    if (!favoris) return res.status(404).send("favoris not found");
    res.json({ message: "favoris deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
