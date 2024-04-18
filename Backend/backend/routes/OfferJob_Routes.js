const express = require("express");
const Offer = require("../models/OfferJob");
const Offercontroller = require("../controllers/OfferJob_Controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/count/:userId", Offercontroller.count);
router.get("/all/count", Offercontroller.countOffer);

router.get("/filter/price/:minPrice/:maxPrice/:id", Offercontroller.filter);
router.get("/filter/category/:category/:id", Offercontroller.filter);
router.get("/filter/address/:address/:id", Offercontroller.filter);
router.get(
  "/filter/addressandcategory/:category/:address/:id",
  Offercontroller.filter
);
router.get(
  "/filter/priceandaddress/:minPrice/:maxPrice/:address/:id",
  Offercontroller.filter
);
router.get(
  "/filter/priceandcategory/:minPrice/:maxPrice/:category/:id",
  Offercontroller.filter
);
router.get(
  "/filter/all/:minPrice/:maxPrice/:category/:address/:id",
  Offercontroller.filter
);


router.get("/search/:address/:userId", Offercontroller.getOfferByTitle);
router.get("/category/:categoryId",Offercontroller.getofferbycategoryId)
router.get('/pricerange',Offercontroller.priceRange)
router.post("/", fileUpload.single("media"), Offercontroller.createOfferr);
router.patch(
  "/:offerId",
  fileUpload.array("media"),
  Offercontroller.updateOffer
);
router.delete("/:id", Offercontroller.deleteOffer);
router.get("/:appownerId", Offercontroller.getOffers); // offers appowner
router.get("/offer/:id", Offercontroller.getOfferById);

module.exports = router;
