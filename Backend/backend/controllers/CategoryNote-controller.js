const CategoryNote = require("../models/CategoryNote");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Note = require("../models/Note");

exports.getCategoriesNotes = async (req, res, next) => {
  let categories;
  try {
    categories = await CategoryNote.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching categories failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    categoriesNote: categories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};

exports.getCategoryNoteById = async (req, res, next) => {
  const categoryId = req.params.id;
  let category;
  try {
    category = await CategoryNote.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ categoryNote: category.toObject({ getters: true }) });
};

exports.getCategoryNoteByName = async (req, res, next) => {
  let str = req.params.name;
  let category;
  try {
    category = await CategoryNote.find({
      name: { $regex: str, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching category failed, please try again later",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(
      "Could not find an category with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ categoryNote: category });
};

exports.createCategoryNote = async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  let existingCategory;
  try {
    existingCategory = await CategoryNote.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating category failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingCategory) {
    return next(new HttpError("category exists already", 422));
  }

  let createdCategory = new CategoryNote({ name, Note: [] });
  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating Category failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ CategoryNote: createdCategory });
};

exports.updateCategoryNote = async (req, res, next) => {
  const categoryId = req.params.id;
  let upcategory;

  try {
    upcategory = await CategoryNote.findById(categoryId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upcategory) {
    const error = new HttpError(
      "Could not find abonnement for the provided id.",
      404
    );
    return next(error);
  }

  const { name } = req.body;

  if (name) upcategory.name = name;

  try {
    await upcategory.save();
  } catch (err) {
    const error = new HttpError(
      "updating abonnement failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ categoryNote: upcategory });
};

exports.deleteCategoryNote = async (req, res, next) => {
  const categoryID = req.params.id;
  let category;
  try {
    category = await CategoryNote.findById(categoryID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category..",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError("Could not find category for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    category.notes.map(async (bk) => {
      let bd;
      try {
        bd = await Note.findById(bk.toString());
        bd.category = null;
        await bd.save({ session: sess });
      } catch (err) {}
    });
    await category.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category.",
      500
    );
  }
  res.status(200).json({ message: "Deleted category." });
};

exports.countCategoryNote = async (req, res) => {
  try {
    const count = await CategoryNote.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
