// server/controllers/shop/address-controller.js

const Address = require("../../models/address");

//add
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    // Check if the data is valid
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }
    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
      message: "Address added successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch
const fetchAllAddress = async (req, res) => {
  // Check if the user is present
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User id is manadatory!",
    });
  }

  const addressesList = await Address.find({ userId });

  res.status(200).json({
    success: true,
    data: addressesList,
  });

  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    // Check if the data is present
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address is manadatory!",
      });
    }

    // Update the address
    const address = await Address.findOneAndUpdate(
      {
        _id: addressId, // Finds a document with this specific _id
        userId, // Ensures that the document belongs to the given user
      },
      formData, // Updates the found document with this new data
      { new: true } // Returns the updated document instead of the old one
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Check if the data is present
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address is manadatory!",
      });
    }
    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
