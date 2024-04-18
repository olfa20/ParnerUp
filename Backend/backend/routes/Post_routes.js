const express = require("express");
const Post = require("../models/Post");
const postcontroller = require("../controllers/PostController");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get("/count", postcontroller.countPost);
router.get("/all/:userId", postcontroller.getAll)
router.post("/", fileUpload.single("media"), postcontroller.createPost);
router.patch("/:postId", fileUpload.array("media"), postcontroller.updatePost);

router.delete("/:id", postcontroller.deletePost);
router.get("/:influencerId", postcontroller.getPosts);
router.get("/poste/:id", postcontroller.getPostById);

module.exports = router;
