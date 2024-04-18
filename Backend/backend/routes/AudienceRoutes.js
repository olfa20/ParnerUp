const express = require("express");
const AudienceController = require("../controllers/Audience-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get("/count", AudienceController.countAudience);
router.get("/audiences", AudienceController.getAudiences);
router.get("/:id", AudienceController.getAudienceById);
router.get("/getaudiencebyname/:name", AudienceController.getAudienceByName);
router.post("/", AudienceController.createAudience);
router.patch("/:id", AudienceController.updateAudience);
router.delete("/:id", AudienceController.deleteAudience);

module.exports = router;
