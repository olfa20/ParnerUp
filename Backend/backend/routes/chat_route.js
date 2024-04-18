const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const fileUpload = require("../middleware/file-upload");

router.get("/:senderId/:receiverId/:limit", chatController.getChats);
router.post("/",fileUpload.single("media"), chatController.createChat);

router.get("/all/:userId", chatController.userChats);

router.get("/:userId/:search", chatController.userChats);

router.delete("/:id",chatController.deleteChat)
module.exports = router;

