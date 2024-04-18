const express = require("express");
const ContentController = require("../controllers/Content-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/count',ContentController.countContent)
router.get("/contents",ContentController.getContent)
router.get("/:id",ContentController.getContentById)
router.get("/getcontentbyname/:name",ContentController.getContentByName)
router.post("/",ContentController.createContent)
router.patch('/:id',ContentController.updateContent)
router.delete('/:id',ContentController.deleteContent)

module.exports = router;
 