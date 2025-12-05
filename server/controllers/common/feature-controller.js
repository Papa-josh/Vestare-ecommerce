// server/controllers/common/feature-controller .js

const Feature = require("../../models/Feature");


//Use in admin view
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // console.log(image, "imageee")

    const featuresImages = new Feature({
      image
    });

    await featuresImages.save();

    res.status(201).json({
      success: true,
      data: featuresImages,
    
      
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error occured",
    });
  }
};


// Use in client view
const getFeatureImages = async (req, res) => {
  try {

    const images = await Feature.find({})

        res.status(200).json({
      success: true,
      data : images
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error occured",
    });
  }
};


module.exports = {addFeatureImage, getFeatureImages}
