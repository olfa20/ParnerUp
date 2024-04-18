const express = require("express");
const PublicController = require("../controllers/PublicController");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/count',PublicController.countPublic)
router.get("/publics",PublicController.getPublics)
router.get("/:id",PublicController.getPublicById)
router.get("/getpublicbyname/:name",PublicController.getPublicByName)
router.post("/",PublicController.createPublic)
router.patch('/:id',PublicController.updatePublic)
router.delete('/:id',PublicController.deletePublic)
module.exports = router;