const express = require("express");
const RecommendationController = require("../controllers/Recommandation-Controller");

const router = express.Router();
router.get('/all',RecommendationController.getAllRecommendation)
router.post("/", RecommendationController.CreateRecommandation);

module.exports = router;
