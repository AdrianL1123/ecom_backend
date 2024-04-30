const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//* middleware to handle JSON request
app.use(express.json());

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
  .connect("mongodb://127.0.0.1:27017/ecom")
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

app.listen(8888, () => {
  console.log("Server is running at http://localhost:8888");
});
