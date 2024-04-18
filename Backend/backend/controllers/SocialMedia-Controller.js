const mongoose = require("mongoose");
const Social = require("../models/SocialMedia ");
const HttpError = require("../models/http-error");
const validUrl = require("valid-url");

exports.getAllAccounts = async (req, res) => {
  const userId = req.params.userId;

  try {
    let accounts = await Social.find({
      owner: mongoose.Types.ObjectId(userId),
    });
    
    if (accounts.length === 0) {
      const newSocial = new Social({
        owner: userId,
        instagramUrl: "https://www.instagram.com/",
        twitterUrl: "https://www.twitter.com/",
        facebookUrl: "https://www.facebook.com/",
        youtubeUrl: "https://www.youtube.com/",
        tiktokUrl: "https://www.tiktok.com/",
        linkedinUrl: "https://www.linkedin.com/",
      });

      accounts = [await newSocial.save()];
    }

    const responseData = {
      success: true,
      user: accounts[0],
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
};

exports.UpdateAccount = async (req, res, next) => {
  const accoundId = req.params.id;

  let upaccount;

  try {
    upaccount = await Social.findOne({
      owner: new mongoose.Types.ObjectId(accoundId),
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upaccount) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const {
    instagramUrl,
    twitterUrl,
    linkedinUrl,
    youtubeUrl,
    facebookUrl,
    tiktokUrl,
    all,
  } = req.body;


  if (instagramUrl) upaccount.instagramUrl = instagramUrl;
  if (twitterUrl) upaccount.twitterUrl = twitterUrl;
  if (linkedinUrl) upaccount.linkedinUrl = linkedinUrl;
  if (youtubeUrl) upaccount.youtubeUrl = youtubeUrl;
  if (tiktokUrl) upaccount.tiktokUrl = tiktokUrl;
  if (facebookUrl) upaccount.facebookUrl = facebookUrl;
  if (all) upaccount.all = all;

  try {
    await upaccount.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating Post failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ account: upaccount });
};


