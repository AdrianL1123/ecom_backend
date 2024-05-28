const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGODB_URL } = require("./config");

const app = express();

//* middleware to handle JSON request
app.use(express.json());
//* set the uploads folder as static path
app.use("/uploads", express.static("uploads"));

//* middleware to setup cors
const corsHandler = cors({
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: true,
  optionsSuccessStatus: 200,
});

//* cors to middleware
app.use(corsHandler);

//* connect to mongodb
mongoose
  .connect(MONGODB_URL + "ecom")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const productRouter = require("./routes/product");
app.use("/products", productRouter);

const categoriesRouter = require("./routes/category");
app.use("/categories", categoriesRouter);

const orderRouter = require("./routes/order");
app.use("/orders", orderRouter);

const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);

const imagesRouter = require("./routes/image");
app.use("/images", imagesRouter);

const userRoute = require("./routes/user");
app.use("/users", userRoute);

app.listen(8888, () => {
  console.log("Server is running at http://localhost:8888");
});
