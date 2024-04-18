const express = require("express");
const ReachController = require("../controllers/Reach-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get("/count", ReachController.countReach);
router.get("/audiences", ReachController.getReaches);
router.get("/:id", ReachController.getReachById);
router.get("/getreachbyname/:name", ReachController.getReachByName);
router.post("/", ReachController.createReach);
router.patch("/:id", ReachController.updateReach);
router.delete("/:id", ReachController.deleteReach);
module.exports = router;
