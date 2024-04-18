const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const FavorisController = require("../controllers/Favoris-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.post("/:offerId/:influencerId",FavorisController.CreateFavoris)
router.get("/:influencerId",FavorisController.getFavoris)
router.delete("/:id",FavorisController.deleteFavoris)

module.exports = router;