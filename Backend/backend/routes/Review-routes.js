const express = require("express");
const reviewController = require("../controllers/Review-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/count",reviewController.countReview)
router.post("/", reviewController.SendReview);
router.get("/:id", reviewController.getReviewByCompany);
router.delete("/:id", reviewController.deleteReview);
router.get('/count/:companyId',reviewController.getReviewStats)

module.exports = router;
