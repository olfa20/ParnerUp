const User = require("../models/User");
const mongoose = require("mongoose");
const CollaborationInfluencer = require("../models/CollaborationInfluencer");
const HttpError = require("../models/http-error");
const Event = require("../models/Events");
const Notification = require("../models/Notification");

const Offer = require("../models/OfferJob");
const AcceptedCandidate = require("../models/AcceptedCondidat");

exports.getCollaboration = async (req, res, next) => {
  const influencerId = req.params.influencerId;
  let collaboration;
  try {
    collaboration = await CollaborationInfluencer.find({
      influencer: mongoose.Types.ObjectId(influencerId),
    })
      .populate("appowner")
      .populate("job");
    res.json(collaboration);
  } catch (error) {
    console.error(error);
  }
};

exports.CreateCollaboration = async (req, res, next) => {
  const eventId = req.params.eventId;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not fetch event." });
  }

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }
  let influencer;
  try {
    influencer = await User.findById(event.influencer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not fetch influencer." });
  }
  if (!influencer) {
    return res.status(404).json({ message: "Influencer not found." });
  }
  let offer;
  try {
    offer = await Offer.findById(event.job);
  } catch {
    console.log(error);
    return res.status(500).json({ message: "Could not fetch offer." });
  }
  if (!offer) {
    return res.status(404).json({ message: "Offer not found." });
  }

  let collaboration = new CollaborationInfluencer({
    influencer: event.influencer,
    appowner: event.appowner,
    job: event.job,
  });

  const notification = new Notification({
    receiver: event.appowner,
    message: `Your offer titled "${offer.title}" has been completed by ${influencer.fname} ${influencer.lname}.`,
    image: influencer.profileImage,
  });

  try {
    event = await Event.findByIdAndDelete(eventId);
  } catch {
    return res.status(500).json({ message: "Could not delete this event." });
  }

  try {
    await collaboration.save();
    await notification.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not create collaboration." });
  }

  res.json(collaboration);
};

exports.CountCollaboration = async (req, res, next) => {
  const influencerId = req.params.id;

  try {
    const count = await CollaborationInfluencer.countDocuments({
      influencer: influencerId,
    });

    const influencer = await User.findById(influencerId);
    influencer.numberOfCollaborations = count;
    await influencer.save();

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Calculate total price for every influencer

exports.calculate = async (req, res, next) => {
  const influencerId = req.params.influencerId;

  try {
    const result = await CollaborationInfluencer.aggregate([
      {
        $match: { influencer: mongoose.Types.ObjectId(influencerId) }, // filter the collaboration that have this influencer
      },
      {
        $lookup: {
          from: "offers",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $group: {
          _id: influencerId,
          total: { $sum: "$job.price" },
        },
      }, //regrouper les résultats par le champ influencer et calculer la somme du champ price dans la collection Offer
    ]);

    // Return the first object in the array as an object with only the total field
    res.json({ total: result[0].total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getCollaborationByTitle = async (req, res, next) => {
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

  let collaboration;

  try {
    const jobIds = jobs.map((job) => job._id); // extract the _id of each job
    collaboration = await CollaborationInfluencer.find({
      job: { $in: jobIds }, // query for accepted candidates whose job is included in the extracted _id array
    }).populate("influencer appowner job");
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching candidates failed, please try again later",
      500
    );
    return next(error);
  }

  if (!collaboration || collaboration.length === 0) {
    const error = new HttpError(
      "Could not find any collaboration with the provided title",
      404
    );
    return next(error);
  }

  res.json({ collaboration: collaboration });
};

exports.countCompany = async (req, res, next) => {
  const influencerId = req.params.id;
  let collaborations;
  try {
    collaborations = await CollaborationInfluencer.find({
      influencer: influencerId,
    });
  } catch (error) {
    console.log(error);
    const err = new HttpError(
      "Fetching collaborations failed, please try again later",
      500
    );
    return next(err);
  }

  if (!collaborations) {
    const err = new HttpError(
      "Could not find any collaborations with this influencerId",
      404
    );
    return next(err);
  }

  const appowners = new Set(); //creates a new empty Set object: object in JavaScript that allows to store unique values of any type
  for (const collaboration of collaborations) {
    const appownerId = collaboration.appowner.toString();
    appowners.add(appownerId);
  }

  const count = appowners.size;

  res.status(200).json({ count });
};

exports.deleteCollaboration = async (req, res) => {
  try {
    const collaboration = await CollaborationInfluencer.findByIdAndDelete(
      req.params.id
    );
    if (!collaboration) return res.status(404).send("Collaboration not found");
    res.json({ message: "Collaboration deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getCollaborationsPerMonth = async (req, res) => {
  try {
    const collaborationsPerMonth = await CollaborationInfluencer.aggregate([
      {
        $group: {
          _id: { $month: "$Date" }, // Regrouper par mois en utilisant l'opérateur $month sur le champ "Date"
          count: { $sum: 1 }, // Compter le nombre de collaborations pour chaque groupe
        },
      },
    ]);

    const monthlyCounts = Array.from({ length: 12 }, (_, i) => {
      // Créer un tableau avec 12 entrées représentant les mois de l'année
      const month = i + 1;
      const foundMonth = collaborationsPerMonth.find(
        // Rechercher le mois correspondant dans les résultats de l'agrégation

        (item) => item._id === month
      );
      const count = foundMonth ? foundMonth.count : 0; // Récupérer le nombre de collaborations pour le mois ou mettre 0 si non trouvé

      return { month, count };
    });

    res.json(monthlyCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
