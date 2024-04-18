const mongoose = require("mongoose");
const Offer = require("../models/OfferJob");
const HttpError = require("../models/http-error");
const Category = require("../models/Category");

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).send("offer not found");
    res.json({ message: "offer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getOfferById = async (req, res, next) => {
  const offerId = req.params.id;
  let offer;
  try {
    offer = await Offer.findById(offerId).populate("category");
  } catch (error) {
    console.log(error);
  }
  if (!offer) {
    const error = new HttpError(
      "Could not find offer for the provided id.",
      404
    );
    return next(error);
  }

  res.json(offer);
};

exports.updateOffer = async (req, res, next) => {
  const offerId = req.params.offerId;
  let upoffer;

  try {
    upoffer = await Offer.findById(offerId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upoffer) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const {
    title,
    overview,
    requirements,
    responsibilities,
    dateEvent,
    address,
    price,
    category,
  } = req.body;

  if (title) upoffer.title = title;
  if (overview) upoffer.overview = overview;
  if (requirements) upoffer.requirements = requirements;
  if (responsibilities) upoffer.responsibilities = responsibilities;
  if (dateEvent) upoffer.dateEvent = dateEvent;
  if (address) upoffer.address = address;
  if (price) upoffer.price = price;
  if (category) upoffer.category = category;

  if (req.files && req.files.length > 0) {
    upoffer.media = req.files.map((file) => file.path);
  }
  try {
    await upoffer.save();
  } catch (err) {
    const error = new HttpError("updating Post failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ offer: upoffer });
};

exports.count = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await Offer.countDocuments({ created_by: userId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOfferByTitle = async (req, res, next) => {
  let str = req.params.address;
  const userId = req.params.userId;

  let offer;
  try {
    offer = await Offer.find({
      created_by: userId,
      address: { $regex: str, $options: "i" },
      quantity: { $gt: 1 },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching book failed, please try again later",
      500
    );
    return next(error);
  }

  if (!offer) {
    const error = new HttpError(
      "Could not find an abonnement with the provided Name",
      404
    );
    return next(error);
  }
  res.json({ offer: offer });
};


exports.getOffers = async (req, res, next) => {
  const appownerId = req.params.appownerId;
  const page = req.query.page ? req.query.page : 1;
  const documentsPerPage = req.query.documentsPerPage
    ? req.query.documentsPerPage
    : 9;
  let offers;
  const skipPipeline = { $skip: (page - 1) * documentsPerPage };
  const limitPipeline = { $limit: documentsPerPage };

  try {
    offers = await Offer.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(appownerId) } },
      skipPipeline,
      limitPipeline,
    ]);
    res.json(offers);
  } catch (error) {
    console.error(error);
  }
};

exports.countOffer = async (req, res) => {
  try {
    const count = await Offer.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.filter = async (req, res, next) => {
  const minPrice = req.params.minPrice;
  const maxPrice = req.params.maxPrice;
  const category = req.params.category;
  // const titleRegex = new RegExp(req.params.title, "i");
  const addressRegex = new RegExp(req.params.address, "i");
  const userId = req.params.id;
  let offers;

  try {
    if (req.params.address && !category && minPrice && maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        address: addressRegex,
        price: { $gt: minPrice, $lt: maxPrice },
        created_by: userId,
      });
    } else if (!req.params.address && category && minPrice && maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        price: { $gt: minPrice, $lt: maxPrice },
        category: category,
        created_by: userId,
      });
    } else if (!req.params.address && !category && minPrice && maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        price: { $gt: minPrice, $lt: maxPrice },
        created_by: userId,
      });
    } else if (!req.params.address && category && !minPrice && !maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        category: category,
        created_by: userId,
      });
    } else if (req.params.address && !category && !minPrice && !maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        address: addressRegex,
        created_by: userId,
      });
    } else if (req.params.address && category && !minPrice && !maxPrice) {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        address: addressRegex,
        category: category,
        created_by: userId,
      });
    } else {
      offers = await Offer.find({
        quantity: { $gt: 1 },
        price: { $gt: minPrice, $lt: maxPrice },
        address: addressRegex,
        category: category,
        created_by: userId,
      });
    }
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching books failed, please try again later",
      500
    );
    return next(error);
  }

  if (!offers) {
    const error = new HttpError(
      "Could not find an offer with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ offers: offers });
};

exports.createOfferr = async (req, res, next) => {
  const {
    title,
    overview,
    responsibilities,
    requirements,
    created_by,
    date,
    dateEvent,
    address,
    price,
    category,
  } = req.body;

  let media;
  if (req.file && !!req.file.path) {
    media = req.file.path;
  }

  try {
    const offer = new Offer({
      title,
      overview,
      responsibilities,
      requirements,
      media,
      created_by,
      date,
      dateEvent,
      address,
      price,
      category,
    });

    let existingCategory;
    try {
      existingCategory = await Category.findById(
        mongoose.Types.ObjectId(category)
      );
    } catch (err) {
      return next(
        new HttpError(
          err.message || "Fetching category failed, please try again later",
          500
        )
      );
    }
    if (!existingCategory) {
      return next(
        new HttpError("Could not find category with the provided ID.", 404)
      );
    }
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await offer.save({ session: sess });
      existingCategory.offers.push(offer);
      await existingCategory.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        err.message || "Creating offer failed, please try again later.",
        500
      );
      return next(error);
    }
    res.status(201).json({ offer: offer });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating offer failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.getofferbycategoryId = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const offers = await Offer.find({ category: categoryId });
    if (!offers || offers.length === 0) {
      console.log("No offers found");
      return res.status(404).json({ message: "No offers found" });
    }
    res.status(200).json({ offers: offers });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching offers failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.priceRange = async (req, res, next) => {
  try {
    const min = await Offer.findOne().sort({ price: 1 }).select({ price: 1 }).lean();
    const minPrice = min.price ? parseFloat(min.price) : null;

    const max = await Offer.findOne().sort({ price: -1 }).select({ price: 1 }).lean();
    const maxPrice = max.price ? parseFloat(max.price) : null;

    const result = {
      min: minPrice,
      max: maxPrice,
    };
    res.json(result);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching books failed, please try again later",
      500
    );
    return next(error);
  }
};

