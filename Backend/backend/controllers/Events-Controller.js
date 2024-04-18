const User = require("../models/User");
const mongoose = require("mongoose");
const Events = require("../models/Events");
const Offer = require("../models/OfferJob");
const HttpError = require("../models/http-error");

exports.getEvents = async (req, res, next) => {
  const influencerId = req.params.influencerId;
  let event;
  try {
    event = await Events.find({
      influencer: mongoose.Types.ObjectId(influencerId),
    })
      .populate("appowner")
      .populate("job");
    res.json(event);
  } catch (error) {
    console.error(error);
  }
};

exports.deleteCondidat = async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send("Event not found");
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// exports.getEventByTitle = async (req, res, next) => {
//   const title = req.params.title;

//   let jobs;

//   try {
//     jobs = await Offer.find({ title: { $regex: title, $options: "i" } });
//   } catch (err) {
//     const error = new HttpError(
//       err.message || "Fetching jobs failed, please try again later",
//       500
//     );
//     return next(error);
//   }

//   let event;

//   try {
//     const jobIds = jobs.map((job) => job._id); // extract the _id of each job
//     event = await Events.find({
//       job: { $in: jobIds }, // query for accepted candidates whose job is included in the extracted _id array
//     }).populate("influencer appowner job");
//   } catch (err) {
//     const error = new HttpError(
//       err.message || "Fetching candidates failed, please try again later",
//       500
//     );
//     return next(error);
//   }

//   if (!event || event.length === 0) {
//     const error = new HttpError(
//       "Could not find any candidate with the provided title",
//       404
//     );
//     return next(error);
//   }

//   res.json({ event: event });
// };

exports.getEventByTitle = async (req, res, next) => {
  const title = req.params.title;
  const userId = req.params.userId;
  console.log(title, userId);
  let jobs;

  try {
    jobs = await Offer.find({
      title: { $regex: title, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching jobs failed, please try again later",
      500
    );
    return next(error);
  }

  let event;

  try {
    const jobIds = jobs.map((job) => job._id); // extract the _id of each job
    event = await Events.find({
      job: { $in: jobIds },
      influencer: userId, // query for events whose job is included in the extracted _id array
    })
      .populate("influencer")
      .populate("appowner")
      .populate("job");
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching events failed, please try again later",
      500
    );
    return next(error);
  }

  if (!event || event.length === 0) {
    const error = new HttpError(
      "Could not find any event with the provided title",
      404
    );
    return next(error);
  }

  res.json({ event: event });
};

exports.count = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await Events.countDocuments({ created_by: userId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
