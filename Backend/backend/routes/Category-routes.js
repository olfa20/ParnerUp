const express = require("express");
const CategoryController = require("../controllers/Category-Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/count',CategoryController.countCategory)
router.get("/all",CategoryController.getCategories)
router.get("/:id",CategoryController.getCategoryById)
router.get("/getbyname/:name",CategoryController.getCategoryByName)
router.post("/",CategoryController.createCategory)
router.patch('/:id',CategoryController.updateCategory)
router.delete('/:id',CategoryController.deleteCategory)

module.exports = router;


