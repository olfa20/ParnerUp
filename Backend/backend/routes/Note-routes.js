const express = require("express");

const notecontroller = require("../controllers/Note-Controller");

const router = express.Router();
router.get("/count", notecontroller.countNote);

router.post("/", notecontroller.createNote);
router.patch("/:noteId", notecontroller.updateNote);

router.delete("/:id", notecontroller.deleteNote);
router.get("/:influencerId", notecontroller.getNotes);
router.get("/note/:id", notecontroller.getNoteById);
router.get("/filter/categorynote/:category/:id", notecontroller.filter);
router.get("/notification/:id",notecontroller.sendNotification)

module.exports = router;
