// server/controllers/auth/auth-controller.js

//For hashing the password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

//REGISTER
//This will store a data (user) into your database
//Think what are the things that I will be having in my register, so notice you have username, email, password. And these three things you need to pass it from your client side to backend, so you'll be getting it from "request body" so in the body we are going to pass all of the data (data from register page)
const registerUser = async (req, res) => {
  // Here, what are the things you need (userName, email, password)
  const { userName, email, password } = req.body;

  try {
    //Check if the user is existing
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.json({
        success: false,
        message:
          existingUser.email === email
            ? "User already exists with the same email! Please try again."
            : "User already exists with the same username! Please try again.",
      });
    }

    //Hashing the password
    const hashPassword = await bcrypt.hash(password, 12);
    //
    //This will create new User
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    //
    //Once you create a new User, you need to save it in your database
    await newUser.save();
    //
    //Once saving is done, you will pass a status property of 200 that success: true,
    res.status(200).json({
      success: true,
      message: "Registered successfully",
    });
    //
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

//LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    //Check if the user is existing
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist! Register first.",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    //testing to try to get the password
    // console.log("Input Password:", password);
    // console.log("Stored Password (Hashed):", checkUser.password);
    // console.log(checkPasswordMatch);

    //Check password if match
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Try again.",
      });

    //Generate token
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "166h" }
    );

    //secure: false //if only on localhost or non-HTTPS environments
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.id,
        userName: checkUser.userName,
      },
    });

    //first check email if exists or not
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

//
//LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    //Clear the token
    success: true,
    message: "Logged out successfully",
  });
};

//
//
//AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token received:", token);

  //Check if token exists. Definitely user will not be able to access
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    //decode the token to get the information of the user back because token is encrypted. So we need to decrypt it.
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded; //return the user information
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

// Then export
module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
