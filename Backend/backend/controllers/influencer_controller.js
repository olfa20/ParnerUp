const HttpError = require("../models/http-error");
const User = require("../models/User");
/* const AppOwner = require("../models/appOwner"); */
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Content = require("../models/Content");
const Public = require("../models/Public");
const Audience = require("../models/Audience");

// Get Influencer by id
const getInfluencerById = async (req, res, next) => {
  const influencerId = req.params.id;
  let influencer;
  try {
    influencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      userType: "influencer",
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!influencer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }
  res.json({
    success: true,
    user: influencer.toObject({ getters: true }),
  });
};

//Update Influencer

const updateInfluencer = async (req, res, next) => {
  const influencerId = req.params.id;

  let upinfluencer;

  try {
    upinfluencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      userType: "influencer",
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upinfluencer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const {
    fname,
    lname,
    email,
    phone,
    city,
    category,
    audience,
    audienceAges,
    gain,
    description,
    postDescription,
    address,
  } = req.body;

  if (fname) upinfluencer.fname = fname;

  if (lname) upinfluencer.lname = lname;
  if (phone) upinfluencer.phone = phone;
  if (category) upinfluencer.category = category;
  if (city) upinfluencer.city = city;
  if (audienceAges) upinfluencer.audienceAges = audienceAges;
  if (email) upinfluencer.email = email;
  if (gain) upinfluencer.gain = gain;
  if (audience) upinfluencer.audience = audience;
  if (description) upinfluencer.description = description;
  if (postDescription) upinfluencer.postDescription = postDescription;
  if (address) upinfluencer.address = address;
  if (req.file && !!req.file.path) {
    upinfluencer.profileImage = req.file.path;
  }

  try {
    await upinfluencer.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating user failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: upinfluencer });
};

// update password

const updatepass = async (req, res, next) => {
  const influencerId = req.params.id;

  let upinfluencer;
  try {
    upinfluencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      // userType: "influencer",
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }

  if (!upinfluencer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const { currentPassword, newPassword } = req.body;
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      currentPassword,
      upinfluencer.password
    );
  } catch (err) {
    const error = new HttpError(
      "Could not change the password, please try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Current password is invalid, please try again.",
      401
    );
    return next(error);
  }

  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "updating password failed, please try again.",
      500
    );
    return next(error);
  }

  upinfluencer.password = hashedpassword;
  try {
    await upinfluencer.save();
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  res
    .status(201)
    .json({ success: true, message: "Password changed successfully." });
};

const getFilteredUsers = async (fname, lname) => {
  return await User.find({
    $or: [
      {
        $and: [
          { fname: { $regex: fname, $options: "i" } },
          { lname: { $regex: lname, $options: "i" } },
          { userType: "influencer" },
        ],
      },
      {
        $and: [
          { lname: { $regex: fname, $options: "i" } },
          { fname: { $regex: lname, $options: "i" } },
          { userType: "influencer" },
          { userType: "appowner" },
        ],
      },
      {
        $and: [
          { company: { $regex: fname, $options: "i" } },
          { company: { $regex: lname, $options: "i" } },
        ],
      },
    ],
  });
};
// get user by fname or lname
const getInfluencerByName = async (req, res, next) => {
  try {
    const name = req.params.name.trim().toLowerCase();

    let [fname, lname] = [];
    if (name.split(/\s+/).length > 1) {
      [fname, lname] = name.split(/\s+/);
    } else {
      fname = name.toString();
      lname = "";
    }

    let users;
    users = await getFilteredUsers(fname, lname);
    if (!users) {
      users = await getFilteredUsers(lname, fname);
    }

    if (users) {
      for (const user of users) {
        if (user.userType === "influencer") {
          user.fname = user.fname + " ( Influencer )";
        } else {
          user.lname = user.company + " ( Agency )";
          user.fname = "";
        }
      }
    }

    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updatecouverture = async (req, res, next) => {
  const influencerId = req.params.id;

  let upinfluencer;

  try {
    upinfluencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      userType: "influencer",
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upinfluencer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  if (req.file && !!req.file.path) {
    upinfluencer.couvertureImage = req.file.path;
  }

  try {
    await upinfluencer.save();
  } catch (err) {
    const error = new HttpError(
      "updating Image failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: upinfluencer });
};

//delete influencer

exports.deleteInfluencer = async (req, res) => {
  try {
    const influencer = await User.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    if (!influencer) return res.status(404).send("Influencer not found");
    res.json({ message: "Influencer account disabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.countInfluencer = async (req, res) => {
  try {
    const count = await User.countDocuments({
      userType: "influencer",
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateInfluenceer = async (req, res, next) => {
  const influencerId = req.params.id;

  let upinfluencer;

  try {
    upinfluencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      userType: "influencer",
    });
  } catch (error) {
    return res.status(404).send({ success: false, error: error.message });
  }
  if (!upinfluencer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const {
    fname,
    lname,
    email,
    phone,
    city,
    country,
    description,
    postDescription,
    address,
    content,
    public,
    audienceAge,
  } = req.body;

  if (fname) upinfluencer.fname = fname;
  if (lname) upinfluencer.lname = lname;
  if (phone) upinfluencer.phone = phone;
  if (city) upinfluencer.city = city;
  if (country) upinfluencer.country = country;
  if (email) upinfluencer.email = email;
  if (description) upinfluencer.description = description;
  if (postDescription) upinfluencer.postDescription = postDescription;
  if (address) upinfluencer.address = address;

  if (req.file && !!req.file.path) {
    upinfluencer.profileImage = req.file.path;
  }

  let existingContent;
  let existingPublic;
  let existingAudience;

  if (content) {
    try {
      existingContent = await Content.findById(
        mongoose.Types.ObjectId(content)
      );
    } catch (err) {
      return next(
        new HttpError(
          err.message || "Fetching content data failed, please try again later",
          500
        )
      );
    }

    if (!existingContent) {
      return next(
        new HttpError(
          "Could not find required content data with the provided ID.",
          404
        )
      );
    }

    existingContent.users = influencerId;
    upinfluencer.content = existingContent._id;
  }

  if (public) {
    try {
      existingPublic = await Public.findById(mongoose.Types.ObjectId(public));
    } catch (err) {
      return next(
        new HttpError(
          err.message || "Fetching public data failed, please try again later",
          500
        )
      );
    }

    if (!existingPublic) {
      return next(
        new HttpError(
          "Could not find required public data with the provided ID.",
          404
        )
      );
    }

    existingPublic.users = influencerId;
    upinfluencer.public = existingPublic._id;
  }
  if (audienceAge) {
    try {
      existingAudience = await Audience.findById(
        mongoose.Types.ObjectId(audienceAge)
      );
    } catch (err) {
      return next(
        new HttpError(
          err.message || "Fetching content data failed, please try again later",
          500
        )
      );
    }

    if (!existingAudience) {
      return next(
        new HttpError(
          "Could not find required content data with the provided ID.",
          404
        )
      );
    }

    existingAudience.users = influencerId;
    upinfluencer.audienceAge = existingAudience._id;
  }

  if (req.file && !!req.file.path) {
    upinfluencer.profileImage = req.file.path;
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await upinfluencer.save({ session: sess });

    if (existingContent) {
      await existingContent.save({ session: sess });
    }

    if (existingPublic) {
      await existingPublic.save({ session: sess });
    }
    if (existingAudience) {
      await existingAudience.save({ session: sess });
    }
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      err.message || "Updating influencer failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ success: true, data: upinfluencer });
};

exports.getinfluencerbycontentId = async (req, res, next) => {
  const contentId = req.params.contentId;

  try {
    const influencers = await User.find({ content: contentId });
    if (!influencers || influencers.length === 0) {
      return res.status(404).json({ message: "No influencers found" });
    }
    res.status(200).json({ influencers: influencers });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching offers failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.filterInfluencers = async (req, res, next) => {
  const content = req.params.content;
  const public = req.params.public;
  const audience = req.params.audience;

  const cityRegex = new RegExp(req.params.city, "i");

  let influencers;

  try {
    if (req.params.city && !content) {
      influencers = await User.find({
        quantity: { $gt: 1 },
        city: cityRegex,

        userType: "influencer",
      });
    } else if (!req.params.city && content) {
      influencers = await User.find({
        quantity: { $gt: 1 },

        content: content,
        userType: "influencer",
      });
    } else if (req.params.city && content) {
      influencers = await User.find({
        quantity: { $gt: 1 },
        city: cityRegex,
        content: content,
        userType: "influencer",
      });
    } else {
      influencers = await User.find({
        quantity: { $gt: 1 },

        city: cityRegex,
        content: content,
        userType: "influencer",
      });
    }
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching books failed, please try again later",
      500
    );
    return next(error);
  }

  if (!influencers) {
    const error = new HttpError(
      "Could not find an offer with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ influencers: influencers });
};

exports.filter = async (req, res, next) => {
  const content = req.params.content;
  const public = req.params.public;
  const audience = req.params.audience;
  const cityRegex = new RegExp(req.params.city, "i");

  let users;

  try {
    if (req.params.city && !content && public && audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        city: cityRegex,
        public: public,
        audienceAge: audience,
        userType: "influencer",
      });
    } else if (!req.params.city && content && public && audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        content: content,
        public: public,
        audienceAge: audience,
        userType: "influencer",
      });
    } else if (!req.params.city && !content && public && audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        public: public,
        audienceAge: audience,
        userType: "influencer",
      });
    } else if (!req.params.city && content && !public && !audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        content: content,
        userType: "influencer",
      });
    } else if (req.params.city && !content && !public && !audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        city: cityRegex,
        userType: "influencer",
      });
    } else if (req.params.city && content && !public && !audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        city: cityRegex,
        content: content,
        userType: "influencer",
      });
    } else if (!req.params.city && !content && public && !audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        public: public,
        userType: "influencer",
      });
    } else if (!req.params.city && !content && !public && audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        audienceAge: audience,
        userType: "influencer",
      });
    } else if (!req.params.city && content && !public && audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        audienceAge: audience,
        content: content,
        userType: "influencer",
      });
    } else if (!req.params.city && content && public && !audience) {
      users = await User.find({
        quantity: { $gt: 1 },
        content: content,
        public: public,
        userType: "influencer",
      });
    } else {
      users = await User.find({
        quantity: { $gt: 1 },
        public: public,
        audienceAge: audience,
        city: cityRegex,
        content: content,
        userType: "influencer",
      });
    }
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching books failed, please try again later",
      500
    );
    return next(error);
  }

  if (!users) {
    const error = new HttpError(
      "Could not find an offer with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ users: users });
};

exports.getInfluencerById = getInfluencerById;

exports.updateInfluencer = updateInfluencer;

exports.updatepass = updatepass;

exports.getInfluencerByName = getInfluencerByName;
exports.updatecouverture = updatecouverture;
