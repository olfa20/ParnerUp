const NotificationApp = require("../models/NotificationAppowner");
const NotificationInlf = require("../models/NotificationInfluencer");
const User = require("../models/User");
const mongoose = require("mongoose");
const Offer = require("../models/OfferJob");
const CondidatsAccepted = require("../models/AcceptedCondidat");
const Events = require("../models/Events");

exports.getAppOwnerNotification = async (req, res) => {
  const { appOwnerId } = req.params;
  const notifs = await NotificationApp.find({
    receiver: new mongoose.Types.ObjectId(appOwnerId),
    viewed: false,
  }).sort({ createdAt: -1 });
  res.status(200).json(notifs);
};

exports.getInfluencerNotification = async (req, res) => {
  const { influencerId } = req.params;

  const notifs = await NotificationInlf.find({
    receiver: new mongoose.Types.ObjectId(influencerId),
    viewed: false,
  }).sort({ createdAt: -1 });

  res.status(200).json(notifs);
};

exports.updateInfluencerNotif = async (req, res) => {
  const { notif } = req.params;
  await NotificationInlf.findByIdAndDelete(notif, { viewed: true });
  res.status(200).json(notif);
};

exports.applyToJob = async (req, res) => {
  const influencerId = req.params.userId;
  const jobId = req.params.jobId;

  try {
    const job = await Offer.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    // test if already exist an application
    let application = job.applications.find(
      (app) => app.influencer.toString() === influencerId.toString()
    );
    if (application) {
      return res
        .status(403)
        .json({ message: "You already applied to this job Offer." });
    }

    let influencer = await User.findOne({
      _id: new mongoose.Types.ObjectId(influencerId),
      userType: "influencer",
    });
    if (!influencer) {
      return res.status(404).json({ message: "Influencer does not exist." });
    }

    const jobApplication = {
      influencer: influencerId,
      job: jobId,
      message: `${influencer.fname} ${influencer.lname} has applied to your job offer "${job.title}".`,
      image: influencer.profileImage,
    };
    await Offer.findByIdAndUpdate(jobId, {
      $push: { applications: jobApplication },
    });
    // Create a notification for the app owner
    const notification = new NotificationApp({
      sender: influencerId,
      receiver: job.created_by,
      message: `${influencer.fname} ${influencer.lname} has applied to your job offer "${job.title}".`,
      job: jobId,
      type: "application",
      image: influencer.profileImage,
    });
    await notification.save();

    res.status(201).json(jobApplication);
  } catch (err) {
    console.error("Error applying to job:", err);
    res
      .status(500)
      .json({ message: "An error occurred while applying to the job offer." });
  }
};

exports.updateJobApplication = async (req, res) => {
  const { offerId } = req.body;
  const { appOwnerId } = req.body;
  const { influencerId } = req.body;
  const { status } = req.body;

  if (!offerId) {
    return res
      .status(400)
      .json({ message: "OfferId is missing in the request body." });
  }

  try {
    const OfferAPP = await Offer.findById(offerId);
    if (!OfferAPP) {
      return res.status(404).json({ message: "Offer not found." });
    }

    if (OfferAPP.created_by.toString() !== appOwnerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to respond to this Offer.",
      });
    }
    let appowner = await User.findById(appOwnerId);

    let application = OfferAPP.applications.find(
      (app) => app.influencer.toString() === influencerId.toString()
    );

    if (!application || application.status != "APPLIED") {
      return res.status(403).json({
        message: "Application does not exist or already updated!",
      });
    }
    // check if the influencer does not apply to this job
    let applications = OfferAPP.applications.filter(
      (app) => app.influencer.toString() != influencerId.toString()
    );
    // status initilise as accepted
    application.status = status ? "ACCEPTED" : "REFUSED";
    application.response = status ? "ACCEPTED" : "REFUSED";
    applications.push(application);

    if (status) {
      // if candidat is accepted create a new accepted condidat for the appowner
      const acceptedCandidate = {
        influencer: influencerId,
        job: offerId,
        appowner: appOwnerId,
      };
      await CondidatsAccepted.create(acceptedCandidate); // create and save new document
    }
    // if condidat is accepted create new event for the influencer

    if (status) {
      const events = {
        influencer: influencerId,
        job: offerId,
        appowner: appOwnerId,
      };
      await Events.create(events);
    }

    await Offer.findByIdAndUpdate(OfferAPP._id, { applications });

    await NotificationApp.findOneAndUpdate(
      {
        job: new mongoose.Types.ObjectId(offerId.toString()),
        sender: new mongoose.Types.ObjectId(influencerId.toString()),
        receiver: new mongoose.Types.ObjectId(appOwnerId.toString()),
      },
      { viewed: true }
    );

    const notification = new NotificationInlf({
      sender: appOwnerId,
      receiver: influencerId,
      message: status
        ? `Your application is ACCEPTED for the job offer "${OfferAPP.title}".`
        : `Your application is REFUSED for the job offer "${OfferAPP.title}".`,
      job: OfferAPP._id,
      type: "RESPONSE",
      image: appowner.profileImage,
    });
    await notification.save();

    res.status(200).json(OfferAPP);
  } catch (err) {
    console.error("Error accepting job application:", err);
    res.status(500).json({
      message: "An error occurred while accepting the job application.",
    });
  }
};

exports.countNotficationInfluencer = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const count = await NotificationInlf.countDocuments({
      receiver: new mongoose.Types.ObjectId(receiverId),
      viewed: false,
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.countNotficationAppowner = async (req, res) => {
  try {
    const appOwnerId = req.params.appownerId;
    const count = await NotificationApp.countDocuments({
      receiver: new mongoose.Types.ObjectId(appOwnerId),
      viewed: false,
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNotificationInfluencer = async (req, res) => {
  try {
    const notification = await NotificationInlf.findByIdAndDelete(
      req.params.id
    );
    if (!notification) return res.status(404).send("Notification not found");
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
