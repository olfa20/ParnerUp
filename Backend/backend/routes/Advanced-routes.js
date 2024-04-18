const express = require("express");
const AdvancedController = require("../controllers/Advanced-controller");

const router = express.Router();
router.get("/count", AdvancedController.countAdvanced);
router.get("/all", AdvancedController.getAdvanceds);
router.get("/:id", AdvancedController.getAdvancedById);
router.get(
  "/getByUserType/:userType",
  AdvancedController.getAdvancedByuserType
);
router.get("/title/:title",AdvancedController.getAdvancedByTitle)
router.get("/userTypeandTitle/:title/:userType",AdvancedController.getAdvancedByTitleAndType)
router.post("/", AdvancedController.CreateAdvanced);
router.patch("/:advancedId", AdvancedController.updateAdvanced);
router.delete("/:id", AdvancedController.deleteAdvanced);

module.exports = router;
