const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/GeneralController");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.get('/count',userController.countAdmin)
router.get("/users/:userId",userController.getAllUsers)
// router.get("/getuser/:userId/:name",userController.get) // getusersamecity
router.get("/appowner",userController.getAllAppowner) // get all appowner
router.get("/influencer", userController.getAllInfluencer); // get all influencer  
router.get("/application/:userId/:appownerId",userController.getapplication)
router.get("/influencerapp/:userId/",userController.getapplicationforinfliencer)
// router.get("/searchUser/:id",userController.getUserByName) // search for problems
router.get("/getUserByName/:name",userController.getinfluencerByName)
router.get("/adminByname/:name",userController.getAdminByName)
router.post("/login", userController.login); 

router.post(
  "/id",
  fileUpload.single("profileImage"),
  userController.createUser
);
router.get("/:userType/:id/verify/:token", userController.verifyLink);
router.get("/:id",userController.getuserbyid)
router.get("/",userController.getAdmins) // get all admins 
router.delete('/:id',userController.deleteAdmin)
router.patch('/:id',fileUpload.single("profileImage"),userController.updateAdmin)


module.exports = router;