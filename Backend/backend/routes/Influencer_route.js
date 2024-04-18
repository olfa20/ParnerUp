const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/influencer_controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/count", userController.countInfluencer);
router.get("/:id", userController.getInfluencerById);

router.get(
  "/filter/publicandaudience/:public/:audience",
  userController.filter
);
router.get("/filter/contentandpublic/:content/:public", userController.filter);
router.get(
  "/filter/contentandaudience/:content/:audience",
  userController.filter
);
router.get("/filter/content/:content", userController.filter);
router.get("/filter/public/:public", userController.filter);
router.get("/filter/audience/:audience", userController.filter);
router.get("/filter/city/:city", userController.filter);
router.get("/filter/cityandcontent/:content/:city", userController.filter);
router.get(
  "/filter/publicaudienceandcity/:public/:audience/:city",
  userController.filter
);
router.get(
  "/filter/publicaudienceandcontent/:public/:audience/:content",
  userController.filter
);
router.get(
  "/filter/all/:public/:audience/:content/:city",
  userController.filter
);

router.patch(
  "/editprofil/:id",
  fileUpload.single("profileImage"),
  userController.updateInfluenceer
);
router.patch("/editpassword/:id", userController.updatepass);
router.get("/content/:contentId", userController.getinfluencerbycontentId);

router.get("/getUserByName/:name", userController.getInfluencerByName); // serach byfname or lname
// router.patch("/editprofil/:id", fileUpload.single("profileImage"), userController.updateInfluencer)
router.patch(
  "/couvertureImage/:id",
  fileUpload.single("couvertureImage"),
  userController.updatecouverture
);

router.delete("/:id", userController.deleteInfluencer);

module.exports = router;
