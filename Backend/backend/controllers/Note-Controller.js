const mongoose = require("mongoose");
const Note = require("../models/Note");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const CategoryNote = require("../models/CategoryNote");
const Notification = require("../models/Notification");

exports.createNote = async (req, res, next) => {
  const { title, description, created_by, createdAt, categoryNote } = req.body;

  try {
    const note = new Note({
      title,
      description,
      created_by,
      categoryNote,
      createdAt,
    });

    let existingCategory;
    try {
      existingCategory = await CategoryNote.findById(
        mongoose.Types.ObjectId(categoryNote)
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
      await note.save({ session: sess });
      existingCategory.notes.push(note);
      await existingCategory.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        err.message || "Creating offer failed, please try again later.",
        500
      );
      return next(error);
    }

    res.status(201).json({ note: note });
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating offer failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).send("note not found");
    res.json({ message: "note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// get posts for specific user
exports.getNotes = async (req, res, next) => {
  const influencerId = req.params.influencerId;
  let notes;
  try {
    notes = await Note.find({
      created_by: mongoose.Types.ObjectId(influencerId),
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
  }
};

exports.getNoteById = async (req, res, next) => {
  const noteId = req.params.id;
  let note;
  try {
    note = await Note.findById(noteId).populate("categoryNote");
  } catch (error) {
    console.log(error);
  }
  if (!note) {
    const error = new HttpError(
      "Could not find note for the provided id.",
      404
    );
    return next(error);
  }

  res.json(note);
};

exports.updateNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  let upNote;

  try {
    upNote = await Note.findById(noteId);
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
  if (!upNote) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const { description, title, categoryNote, createdAt } = req.body;

  if (description) upNote.description = description;

  if (title) upNote.title = title;
  if (categoryNote) upNote.categoryNote = categoryNote;
  if (createdAt) upNote.createdAt = createdAt;

  try {
    await upNote.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating Note failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ note: upNote });
};

//count post
exports.countNote = async (req, res) => {
  try {
    const count = await Note.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//filter

exports.filter = async (req, res, next) => {
  const category = req.params.category;
  const userId = req.params.id;
  let notes;

  try {
    if (category) {
      notes = await Note.find({
        quantity: { $gt: 1 },
        categoryNote: category,
        created_by: userId,
      });
    } else {
      notes = await Note.find({
        quantity: { $gt: 1 },
        categoryNote: category,
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

  if (!notes) {
    const error = new HttpError(
      "Could not find an note with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ notes: notes });
};

exports.sendNotification = async (req, res, next) => {
  const influencerId = req.params.id;

  const notes = await Note.find({ created_by: influencerId });

  if (!notes) {
    const error = new HttpError("Notes do not exist");
    return next(error);
  }

  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);

  const notifications = [];

  for (let i = 0; i < notes.length; i++) {
    const noteDate = new Date(notes[i].createdAt).toISOString().slice(0, 10);

    if (noteDate === todayDate) {
      const notification = new Notification({
        receiver: influencerId,
        message: `You have this '${notes[i].title}' for today.`,
      });
      await notification.save();
      notifications.push(notification);
    }
  }

  if (notifications.length === 0) {
    res.json({ message: "No notifications to send today." });
  } else {
    res.json({ notifications });
  }
};

