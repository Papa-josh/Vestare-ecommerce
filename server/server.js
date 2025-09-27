// server/server.js
//
// here you will mention what are the things that this app going to use

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes.js");
const shopProductsRouter = require("./routes/shop/products-routes.js");
const shopCartRouter = require("./routes/shop/cart-routes.js");
const shopAddressRouter = require("./routes/shop/address-routes.js");
const shopOrderRouter = require("./routes/shop/order-routes.js");

//Create database connection
mongoose
  .connect(
    "mongodb+srv://joshuaagamao2:MyclusLoginRegkey@loginandregistercluster.4ple4.mongodb.net/"
  )
  .then(() => console.log("mongoDb connected"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

//here you will mention what are the things that this app going to use
app.use(
  //CONFIGURE CORS
  cors({
    origin: "http://localhost:5173", //thing that you need to give
    methods: ["GET", "POST", "DELETE", "PUT"], //mention methods that you want to use
    allowedHeaders: [
      //mention headers that you want to use
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

//...  api/auth/register ->registerUser----
//...  api/auth/login ->loginUser

// these are the routes that you are going to use
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);

app.listen(PORT, console.log(`Server is now running on port ${PORT}}`));
