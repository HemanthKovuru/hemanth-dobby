const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const imageController = require("./../controllers/imageController");

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);
router.post(
  "/upload",
  authController.access,
  imageController.alterImage,
  imageController.uploadImage
);

router.get("/images", authController.access, imageController.getAllImages);
router.get("/signout", authController.signout);

module.exports = router;
