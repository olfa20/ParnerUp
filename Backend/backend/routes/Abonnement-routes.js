const express = require("express");
const AbonnementContoller = require("../controllers/AbonnementContoller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/charge',AbonnementContoller.totalAmount)
router.get("/totalabonnement",AbonnementContoller.getTotalSubscribers)
router.get("/count",AbonnementContoller.countAbonnement)
router.get("/getbytitle/:title",AbonnementContoller.getAbonnementByTitle)
router.get('/abonnement',AbonnementContoller.getAllAbonnement)
router.get('/:id',AbonnementContoller.getAbonnementById)
router.post('/',fileUpload.single("media"),AbonnementContoller.createAbonnement)
router.patch('/:abonnementId',fileUpload.array("media"),AbonnementContoller.updateabonnement)
router.delete('/:id',AbonnementContoller.deleteAbonnement)
router.post('/:abonnementId',AbonnementContoller.payment)


module.exports = router;