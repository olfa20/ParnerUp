const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/AppOwner_controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/count',userController.countAppowner)
router.get("/:id", userController.getUpownerById);
router.get("/getappbyname/:name",userController.getappownerByName)
router.patch(
  "/editprofil/:id",
  fileUpload.single("profileImage"),
  userController.updateAppowner
);
router.patch("/editpassword/:id",userController.updatepass)
router.patch("/couvertureImage/:id",fileUpload.single("couvertureImage"),userController.updatecouverture)
router.delete("/:id",userController.deleteAppowner)

module.exports = router;
