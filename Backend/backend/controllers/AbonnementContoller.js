const HttpError = require("../models/http-error");
const Abonnement = require("../models/Abonement");
const mongoose = require("mongoose");
require("dotenv").config();
const Stripe = require("stripe")(process.env.SECRET_KEY);
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createAbonnement = async (req, res, next) => {
  const {
    title,
    services,
    price,
    duration,
    paymentMethod,
    created_by,
    description,
  } = req.body;

  let media;
  if (req.file && !!req.file.path) {
    media = req.file.path;
  }

  let existingAbonnement;
  try {
    existingAbonnement = await Abonnement.findOne({ duration: duration });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating Abonnement failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingAbonnement) {
    return next(new HttpError("Abonnement exists already", 422));
  }

  try {
    const abonnement = new Abonnement({
      title,
      services,
      price,
      duration,
      paymentMethod,
      media,
      created_by,
      description,
    });

    await abonnement.save();
    res.status(201).json(abonnement);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getAllAbonnement = async (req, res, next) => {
  let abonnements;
  try {
    abonnements = await Abonnement.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    abonnements: abonnements.map((abonnement) =>
      abonnement.toObject({ getters: true })
    ),
  });
};

exports.updateabonnement = async (req, res, next) => {
  const abonnementId = req.params.abonnementId;
  let upabonnement;

  try {
    upabonnement = await Abonnement.findById(abonnementId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upabonnement) {
    const error = new HttpError(
      "Could not find abonnement for the provided id.",
      404
    );
    return next(error);
  }

  const {
    title,
    services,
    price,
    duration,
    paymentMethod,
    created_by,
    description,
  } = req.body;

  if (title) upabonnement.title = title;
  if (services) upabonnement.services = services;
  if (duration) upabonnement.duration = duration;
  if (paymentMethod) upabonnement.paymentMethod = paymentMethod;
  if (price) upabonnement.price = price;
  if (description) upabonnement.description = description;
  if (created_by) upabonnement.created_by = created_by;
  if (req.files && req.files.length > 0) {
    upabonnement.media = req.files.map((file) => file.path);
  }
  try {
    await upabonnement.save();
  } catch (err) {
    const error = new HttpError(
      "updating abonnement failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ abonnement: upabonnement });
};

exports.deleteAbonnement = async (req, res) => {
  try {
    const abonnement = await Abonnement.findByIdAndDelete(req.params.id);
    if (!abonnement) return res.status(404).send("Abonnement not found");
    res.json({ message: "Abonnement deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.countAbonnement = async (req, res) => {
  try {
    const count = await Abonnement.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAbonnementById = async (req, res, next) => {
  const abonnementId = req.params.id;
  let abonnement;
  try {
    abonnement = await Abonnement.findOne({
      _id: new mongoose.Types.ObjectId(abonnementId),
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!abonnement) {
    const error = new HttpError(
      "Could not find abonnement for the provided id.",
      404
    );
    return next(error);
  }
  res.json({
    success: true,
    abonnement: abonnement.toObject({ getters: true }),
  });
};

exports.payment = async (req, res, next) => {
  let status, error;
  const { token, amount, userId } = req.body;
  const abonnementId = req.params.abonnementId;
  let abonnement;
  try {
    abonnement = await Abonnement.findById(abonnementId);
    if (!abonnement) {
      return res.status(404).json({ message: "Abonnement not found" });
    }

    const charge = await Stripe.charges.create({
      source: token.id,
      amount,
      currency: "usd",
    });
    status = "success";

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          applications: {
            abonnement: abonnementId,
            subscribedAt: new Date(),
            validUntil: new Date(
              Date.now() + parseInt(abonnement.duration) * 24 * 60 * 60 * 1000 // conversation du jour en miliseconde
            ),
            services: abonnement.services,
          },
        },
      },
      { new: true }
    );

    const updatedAbonnement = await Abonnement.findByIdAndUpdate(
      abonnementId,
      { $inc: { numberOfSubscribers: 1 } },
      { new: true }
    );

    const notification = new Notification({
      receiver: userId,
      message: `You have subscribed to the subscription '${abonnement.title}' successfully..`,
      // image: user.profileImage,
    });
    await notification.save();

    await user.save();
  } catch (error) {
    console.log(error);
    status = "failure";

    const notification = new Notification({
      receiver: userId,
      message: `There was an error processing your payment for subscription '${abonnement.title}'. Please try again later.`,
    });
    await notification.save();
  }
  res.json({ error, status });
};

exports.getTotalSubscribers = async (req, res, next) => {
  try {
    const result = await User.aggregate([
      { $unwind: "$applications" },
      {
        $group: {
          _id: "$applications.abonnement",
          totalSubscribers: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: "$totalSubscribers" },
        },
      },
    ]);

    const totalSubscribers = result[0].totalSubscribers;

    res.json({ totalSubscribers });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.totalAmount = async (req, res, next) => {
  let status, error;
  try {
    const charges = await Stripe.charges.list({ limit: 100 });
    const totalAmount = charges.data.reduce((sum, charge) => {
      if (charge.currency === "usd") {
        return sum + charge.amount;
      } else {
        return sum;
      }
    }, 0);
    return res.json({ error, status: "success", totalAmount });
  } catch (error) {
    console.log(error);
    status = "Failure";
    return res.json({ error, status });
  }
};

exports.getAbonnementByTitle = async (req, res, next) => {
  let str = req.params.title;
  let abonnement;
  try {
    abonnement = await Abonnement.find({
      title: { $regex: str, $options: "i" },
      quantity: { $gt: 1 },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching book failed, please try again later",
      500
    );
    return next(error);
  }

  if (!abonnement) {
    const error = new HttpError(
      "Could not find an abonnement with the provided Name",
      404
    );
    return next(error);
  }
  res.json({ abonnement: abonnement });
};
