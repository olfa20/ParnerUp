const express = require("express");
const CategoryNoteController = require("../controllers/CategoryNote-controller");

const router = express.Router();
router.get("/count", CategoryNoteController.countCategoryNote);
router.get("/all", CategoryNoteController.getCategoriesNotes);
router.get("/:id", CategoryNoteController.getCategoryNoteById);
router.get("/getbyname/:name", CategoryNoteController.getCategoryNoteByName);
router.post("/", CategoryNoteController.createCategoryNote);
router.patch("/:id", CategoryNoteController.updateCategoryNote);
router.delete("/:id", CategoryNoteController.deleteCategoryNote);

module.exports = router;
