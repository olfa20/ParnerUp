const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/SocialMedia-Controller");


const router = express.Router();
router.get("/:userId",userController.getAllAccounts)
// router.post("/",userController.CreateAccount)
router.patch("/:id",userController.UpdateAccount)



module.exports = router;

