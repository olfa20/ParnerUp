const express = require("express");
const problemController = require("../controllers/Problem-Controller")
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get('/getprobelm/:adminId',problemController.getProblem)

router.post('/:userId',fileUpload.single("media"),problemController.ReportProblem)
router.delete('/:id',problemController.deleteProblem)

module.exports = router;