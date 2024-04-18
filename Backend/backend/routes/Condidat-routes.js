const express = require('express');
;
const condidatControlller = require("../controllers/Condidats-Controller")
const fileUpload = require("../middleware/file-upload");


const router = express.Router();

router.get('/status/:id',condidatControlller.calculateStatus)
router.get('/count/:userId',condidatControlller.count)
router.get("/:appownerId",condidatControlller.getCondidatsAccepted)
router.get("/getbytitle/:title",condidatControlller.getCondidatByTitle)
router.patch('/:condidatId',condidatControlller.updatestatus)
router.delete("/:id",condidatControlller.deleteCondidat)


module.exports = router;