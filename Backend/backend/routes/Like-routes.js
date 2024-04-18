const express = require("express");
const likeController = require("../controllers/Like_controller")
const router = express.Router();
router.get('/dashboard/all',likeController.countLikes)
router.get('/count/:postId',likeController.count)
router.get('/all/:postId',likeController.getLikes)
router.post('/:postId/:userId',likeController.createLikes)


module.exports = router;