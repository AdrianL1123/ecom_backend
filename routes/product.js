const express = require("express");
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
} = require("../controllers/product");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const { category, perPage, page } = req.query;
    const products = await getProducts(category, perPage, page);
    res.status(200).send(products);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Product not found!" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//! add
router.post("/", isAdmin, async (req, res) => {
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
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product_id = req.params.id;
    const updatedProduct = await updateProduct(
      product_id,
      name,
      description,
      price,
      category,
      image
    );
    res.status(200).send(updatedProduct);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

//! delete
router.delete("/:id", isAdmin, async (req, res) => {
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
