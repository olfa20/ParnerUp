const express = require("express");
const CollaborationInfluencerController = require("../controllers/CollaborationInfluencer");

const router = express.Router();
router.get('/dashboard/all',CollaborationInfluencerController.getCollaborationsPerMonth)
router.get(
  "/appownernumber/:id",
  CollaborationInfluencerController.countCompany
);
router.get(
  "/getbytitle/:title",
  CollaborationInfluencerController.getCollaborationByTitle
);
router.get("/price/:influencerId", CollaborationInfluencerController.calculate);
router.get("/count/:id", CollaborationInfluencerController.CountCollaboration);
router.get(
  "/:influencerId",
  CollaborationInfluencerController.getCollaboration
);
router.post("/:eventId", CollaborationInfluencerController.CreateCollaboration);
router.delete("/:id", CollaborationInfluencerController.deleteCollaboration);

module.exports = router;
