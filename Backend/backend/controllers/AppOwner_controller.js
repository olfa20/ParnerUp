const HttpError = require("../models/http-error");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getUpownerById = async (req, res, next) => {
  const appownerId = req.params.id;
  let appowner;
  try {
    appowner = await User.findById(appownerId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!appowner) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }
  res.json({
    success: true,
    user: appowner.toObject({ getters: true }),
  });
};

const updateAppowner = async (req, res, next) => {
  const appownerId = req.params.id;

  let upappowner;
  try {
    upappowner = await User.findById(appownerId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upappowner) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const { fname, lname, email, phone, location, description, company, city } =
    req.body;

  if (fname) upappowner.fname = fname;
  if (lname) upappowner.lname = lname;
  if (phone) upappowner.phone = phone;
  if (email) upappowner.email = email;
  if (location) upappowner.location = location;
  if (company) upappowner.company = company;
  if (description) upappowner.description = description;
  if (city) upappowner.city = city;
  if (req.file && !!req.file.path) {
    upappowner.profileImage = req.file.path;
  }

  try {
    await upappowner.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating user failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: upappowner });
};

const updatepass = async (req, res, next) => {
  const appownerId = req.params.id;

  let upappowner;
  try {
    upappowner = await User.findById(appownerId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }

  if (!upappowner) {
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
      upappowner.password
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

  upappowner.password = upappowner;
  try {
    await upappowner.save();
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  res
    .status(201)
    .json({ success: true, message: "Password changed successfully." });
};

const updatecouverture = async (req, res, next) => {
  const appownerId = req.params.id;

  let appowner;

  try {
    appowner = await User.findById(appownerId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }

  if (!appowner) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  if (req.file && req.file.path) {
    const imagePath = req.file.path.replace(/\\\\/g, "\\");
    appowner.couvertureImage = imagePath;
  }

  try {
    await appowner.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "updating Image failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: appowner });
};

exports.countAppowner = async (req, res) => {
  try {
    const count = await User.countDocuments({
      userType: "appowner",
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAppowner = async (req, res) => {
  try {
    const appowner = await User.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    if (!appowner) return res.status(404).send("Appowner not found");
    res.json({ message: "Appowner account disabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getFilteredUsers = async (fname, lname) => {
  return await User.find({
    userType: "appowner",
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
        
      },
    ],
  });
};

exports.getappownerByName = async (req, res, next) => {
  try {
    // Récupère le nom du paramètre de requête, le nettoie des espaces vides et le convertit en minuscules
    const name = req.params.name.trim().toLowerCase();
// Initialise les variables fname et lname à un tableau vide
    let [fname, lname] = [];

    if (name.split(/\s+/).length > 1) { // Vérifie si le nom contient un ou plusieurs espaces pour déterminer s'il s'agit d'un nom complet
      [fname, lname] = name.split(/\s+/); // Si le nom est composé de plusieurs mots, les sépare en prénom et nom de famille
    } else {
      fname = name.toString(); // Si le nom est un seul mot, l'assigne au prénom et laisse le nom de famille vide
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

exports.getUpownerById = getUpownerById;
exports.updateAppowner = updateAppowner;
exports.updatepass = updatepass;
exports.updatecouverture = updatecouverture;
