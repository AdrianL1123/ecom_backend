const express = require("express");
const {
  getProducts,
  addProduct,
  updateProduct,
} = require("../controllers/product");

const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const products = await getProducts(category);
    res.status(200).send(products);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send("Product Not Found");
  }
});

//! add
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const newProduct = await addProduct(name, description, price, category);
    res.status(200).send(newProduct);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

//! update
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product_id = req.params.id;
    const updatedProduct = await updateProduct(
      product_id,
      name,
      description,
      price,
      category
    );
    res.status(200).send(updatedProduct);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

//! delete
router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).send(deleteProduct);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

module.exports = router;
