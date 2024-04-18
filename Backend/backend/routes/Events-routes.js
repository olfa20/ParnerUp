const express = require('express');
const eventController = require("../controllers/Events-Controller")
const fileUpload = require("../middleware/file-upload");


const router = express.Router();
router.get("/count/:userId",eventController.count)
router.get("/:influencerId",eventController.getEvents)
router.get("/getbytitle/:title/:userId",eventController.getEventByTitle)
router.delete("/:id",eventController.deleteCondidat)


module.exports = router;