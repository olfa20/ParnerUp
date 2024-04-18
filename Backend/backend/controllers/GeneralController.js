const HttpError = require("../models/http-error");
const User = require("../models/User");
var passwordValidator = require("password-validator");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const uuid = require("uuid");
const { log, error } = require("console");
const mongoose = require("mongoose");

const webpush = require("web-push");
const { findById } = require("../models/Abonement");

const createUser = async (req, res, next) => {
  const {
    userType, // assuming this field is present in the request body to specify user type
    fname,
    lname,
    email,
    phone,
    password,
    company,
    location,
    city,
    country,
    postcode,
  } = req.body;

  let existingUser;

  // check if user with the same email exists already
  existingUser = await User.findOne({ email: email });

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  // validate password length
  if (password.length < 8) {
    const error = new HttpError(
      "Password must be at least 8 characters long.",
      422
    );
    return next(error);
  }

  // validate password contains at least one number
  if (!/\d/.test(password)) {
    const error = new HttpError(
      "Password must contain at least one number.",
      422
    );
    return next(error);
  }

  // validate password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    const error = new HttpError(
      "Password must contain at least one uppercase letter.",
      422
    );
    return next(error);
  }

  // validate password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    const error = new HttpError(
      "Password must contain at least one lowercase letter.",
      422
    );
    return next(error);
  }

  // validate password contains at least one special character
  if (!/[\W_]/.test(password)) {
    const error = new HttpError(
      "Password must contain at least one special character.",
      422
    );
    return next(error);
  }

  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again.", 500);
    return next(error);
  }

  let createdUser;

  createdUser = new User({
    fname,
    lname,
    phone,
    email,
    password: hashedpassword,
    userType,
    company,
    location,
    city,
    country,
    postcode,
  });
  if (req.file) {
    createdUser.profileImage = req.file.path;
  }
  try {
    await createdUser.save();
    // send verification email

    const token = new Token({
      userId: createdUser._id, 
      token: crypto.randomBytes(32).toString("hex"),
      userType: userType,
    });
    await token.save();

    const url = `${process.env.BASE_URL}${userType}/${createdUser.id}/verify/${token.token}`;
    await sendEmail(createdUser.email, "verify Email", url);
    res.status(201).send({
      message:
        "An email has been sent to your account. Please verify your email.",
    });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }
};

const verifyLink = async (req, res) => {
  try {
    const id = req.params.id;
    const userType = req.params.userType;

    let existingUser;
    existingUser = await User.findOne({ _id: id });

    if (!existingUser) {
      return res.status(400).send({ message: "Invalid link" });
    }

    const token = await Token.findOne({
      userId: existingUser._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).send({ message: "Invalid link" });
    }

    // update the verified status of the user
    existingUser.verified = true;
    await existingUser.save();

    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  if (!user) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid password, please try again.", 401);
    return next(error);
  }

  // Resent link if not verified

  if (!user.verified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}influencer/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "verify Email", url);
    }
    return res
      .status(200)
      .send({ message: "An Email sent to your account please verify" });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.userType,
        active: user.active,
      },
      "olfa_key_jwt",
      { expiresIn: "24h" }
    );
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: user.id,
    email: user.email,
    token: token,
    userType: user.userType,
    active: user.active,
  });
};
// get userbyid

const getuserbyid = async (req, res, next) => {
  const userId = req.params.id;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user or appowner for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    success: true,
    user: user.toObject({ getters: true }),
  });
};

// get all admin
const getAdmins = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ userType: "admin" });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};
// delete admin

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    if (!admin) return res.status(404).send("admin not found");
    res.json({ message: "admin account disabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// update Admin

const updateAdmin = async (req, res, next) => {
  const adminId = req.params.id;

  let upadmin;

  try {
    upadmin = await User.findOne({
      _id: new mongoose.Types.ObjectId(adminId),
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  console.log(upadmin);

  if (!upadmin) {
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
    address,
    location,
    country,
    postcode,
    description,
  } = req.body;

  if (fname) upadmin.fname = fname;
  if (lname) upadmin.lname = lname;
  if (phone) upadmin.phone = phone;
  if (city) upadmin.city = city;
  if (email) upadmin.email = email;
  if (address) upadmin.address = address;
  if (location) upadmin.location = location;
  if (country) upadmin.country = country;
  if (postcode) upadmin.postcode = postcode;
  if (description) upadmin.description = description;
  if (req.file && !!req.file.path) {
    upadmin.profileImage = req.file.path;
  }

  try {
    await upadmin.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "updating admin failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: upadmin });
};

// count Admin

exports.countAdmin = async (req, res) => {
  try {
    const count = await User.countDocuments({
      userType: "admin",
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all influencer
const getAllInfluencer = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ userType: "influencer" });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// getAll appowner
const getAllAppowner = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ userType: "appowner" });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

exports.getapplicationforinfliencer = async (req, res, next) => {
  const userId = req.params.userId;
  const appownerId = req.params.id;
  try {
    const user = await User.findById(userId).populate({
      path: "applications.abonnement",
      populate: {
        path: "services",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove expired applications
    user.applications = user.applications.filter(
      (app) => !app.validUntil || app.validUntil > Date.now()
    );

    // Get services from remaining applications
    const services = [];
    user.applications.forEach((app) => {
      app.abonnement.services.forEach((service) => {
        services.push(service);
      });
    });

    // Update user with removed applications
    await user.save();

    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getapplication = async (req, res, next) => {
  const userId = req.params.userId;
  const appownerId = req.params.appownerId;

  try {
    // Check if the user who made the request is subscribed
    const appowner = await User.findById(appownerId).populate({
      path: "applications.abonnement",
      populate: {
        path: "services",
      },
    });
 
    if (!appowner) {
      return res.status(404).json({ error: "User not found" });
    }

    const subscription = appowner.applications.find(
      (app) => app.validUntil > Date.now()
    );

    if (!subscription) {
      return res.status(403).json({ error: "User is not subscribed" });
    }

    // Get services from user's subscriptions
    const services = [];
    appowner.applications.forEach((app) => {
      app.abonnement.services.forEach((service) => {
        services.push(service);
      });
    });

    // Check if the requested user is subscribed
    const user = await User.findById(userId).populate({
      path: "applications.abonnement",
      populate: {
        path: "services",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userSubscription = user.applications.find(
      (app) => app.validUntil > Date.now()
    );

    if (!userSubscription) {
      return res
        .status(403)
        .json({ error: "Requested user is not subscribed" });
    }

    // Remove expired applications
    user.applications = user.applications.filter(
      (app) => !app.validUntil || app.validUntil > Date.now()
    );

    // Get services from remaining applications
    const userServices = [];
    user.applications.forEach((app) => {
      app.abonnement.services.forEach((service) => {
        userServices.push(service);
      });
    });

    // Update user with removed applications
    await user.save();

    res.json({services, userServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get all users that have the same city
exports.getAllUsers = async (req, res, next) => {
  const userId = req.params.userId;
  let user;

  try {
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }

  let users;
  try {
    const regex = new RegExp(user.city, "i");
    users = await User.find({
      _id: { $ne: userId },
      city: regex,
      userType: { $in: ["influencer", "appowner"] },
    });
  } catch (error) {
    console.log(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// get influencer by name
const getFilteredUsers = async (fname, lname) => {
  return await User.find({
    userType: "influencer",
    $or: [
      {
        $and: [
          { fname: { $regex: fname, $options: "i" } },
          { lname: { $regex: lname, $options: "i" } },
        ],
      },
      {
        $and: [
          { lname: { $regex: fname, $options: "i" } },
          { fname: { $regex: lname, $options: "i" } },
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

exports.getinfluencerByName = async (req, res, next) => {
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

    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getFilteredAdmins = async (fname, lname) => {
  return await User.find({
    userType: "admin",
    $or: [
      {
        $and: [
          { fname: { $regex: fname, $options: "i" } },
          { lname: { $regex: lname, $options: "i" } },
        ],
      },
      {
        $and: [
          { lname: { $regex: fname, $options: "i" } },
          { fname: { $regex: lname, $options: "i" } },
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

exports.getAdminByName = async (req, res, next) => {
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
    users = await getFilteredAdmins(fname, lname);
    if (!users) {
      users = await getFilteredAdmins(lname, fname);
    }

    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};



















exports.createUser = createUser;
exports.verifyLink = verifyLink;
exports.login = login;
exports.getuserbyid = getuserbyid;
exports.getAdmins = getAdmins;
exports.getAllInfluencer = getAllInfluencer;
exports.getAllAppowner = getAllAppowner;
exports.updateAdmin = updateAdmin;
