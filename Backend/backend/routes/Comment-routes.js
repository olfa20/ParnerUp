const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/Comment-Controller");

router.get('/dashboard/all',NotificationController.countComments)
router.post("/:userId", NotificationController.comment);
router.get("/all/:postId", NotificationController.getComments);
router.get(
  "/countnotification/:userId",
  NotificationController.countNotfication
);
router.get("/count/:postId", NotificationController.count);
router.get("/comment/:id", NotificationController.getCommentById);

router.get("/:userId", NotificationController.getNotification);
router.patch("/update/:id", NotificationController.updateNotification);
router.patch("/:commentId", NotificationController.updateComment);
router.delete("/:commentId", NotificationController.deleteComment);
module.exports = router;
