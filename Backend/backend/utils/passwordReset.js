const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("./sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const { ok } = require("assert");
require("dotenv").config();

//send password link

router.post("/", async (req, res) => {
  //validation de l'email
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } =  emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    // send link
 
    let existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser)
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });


    let token = await Token.findOne({ userId: existingUser._id });
    if (!token) {
      token = await new Token({
        userId: existingUser._id,
        token: crypto.randomBytes(32).toString("hex"),
        userType: "influencer"
      }).save();
    }
    const url = `${process.env.BASE_URL}password-reset/${existingUser._id}/${token.token}`;
    await sendEmail(existingUser.email, "Password Reset", url);

    res
      .status(200)
      .send({ message: "password reset link sent to your email account" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

//verify password reset link

router.get("/:id/:token", async (req, res) => {

  try {
    const existingUser = await User.findOne({ _id: req.params.id });
    if (!existingUser) return res.status(400).send({ message: "Invalid link" });
    const token = await Token.findOne({
      userId: existingUser._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    res.status(200).send({ message: "Valid Url" });
    
  } catch (error) {
    res.status(500).send({ message: "Internal server" });
  }
});


// set new password
router.post("/:id/:token", async (req, res) => {

    //validate password
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("password"),
    });
    const { error } = passwordSchema.validate(req.body);

    if (error)  
      return res.status(400).send({ message: error.details[0].message });


      
  let existingUser = await User.findOne({ _id: req.params.id });

    if (!existingUser) return res.status(400).send({ message: " User undefined" });

    const token = await Token.findOne({
      userId: existingUser._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    if (!existingUser.verified) existingUser.verified = true; // if existingUser.verified is not already set to true, the code sets it to true. 
   
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
  
    const hashedpassword = await bcrypt.hash(req.body.password, salt); // hash le nouveau password avec salt

    existingUser.password = hashedpassword; // affecter le nouveau password au ancien password
  
    await existingUser.save();

    await token.remove();
 
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});



module.exports = router;
