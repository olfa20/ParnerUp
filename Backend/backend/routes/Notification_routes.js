const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/Notification_controller");

router.post("/apply/:userId/:jobId", NotificationController.applyToJob);
router.patch("/update", NotificationController.updateJobApplication);
router.get("/:appOwnerId",NotificationController.getAppOwnerNotification)
router.get("/influencer/:influencerId",NotificationController.getInfluencerNotification)
router.get('/count/:receiverId',NotificationController.countNotficationInfluencer)
router.get('/countapp/:appownerId',NotificationController.countNotficationAppowner)
router.delete('/:id',NotificationController.deleteNotificationInfluencer)
module.exports = router;
  