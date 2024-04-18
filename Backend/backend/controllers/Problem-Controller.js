const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const User = require("../models/User");
const HttpError = require("../models/http-error");

exports.ReportProblem = async (req, res, next) => {
  const userId = req.params.userId;
  const { message } = req.body;
  let media;
  if (req.file && !!req.file.path) {
    media = req.file.path;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    const admins = await User.find(
      { userType: { $in: ["admin", "superadmin"] } },
      { _id: 1 }
    );
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "no admin found." });
    }

    const adminIds = admins.map((admin) => admin._id);

    const problem = new Problem({
      sender: userId,
      message: message,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      receiver: adminIds,
      userType: user.userType,
      phone: user.phone,
      media: media,
      company:user.company
    });
    await problem.save();

    res.status(201).json(problem);
  } catch (err) {
    console.log(err);
  }
};

exports.getProblem = async (req, res) => {
  const { adminId } = req.params;
  const problems = await Problem.find({
    receiver: { $in: [new mongoose.Types.ObjectId(adminId)] },
  });

  res.status(200).json(problems);
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).send("Problem not found");
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};



