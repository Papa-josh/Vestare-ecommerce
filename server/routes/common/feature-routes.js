// server/routes/common/feature-routes .js

const express = require("express");

//controllers
const {
  addFeatureImage, getFeatureImages
} = require("../../controllers/common/feature-controller");

const router = express.Router();

//routes
router.post("/add", addFeatureImage);
router.get("/get/", getFeatureImages);


module.exports = router;
