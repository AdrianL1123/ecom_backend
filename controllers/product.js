const Product = require("../models/product");

const getProducts = async (category) => {
  try {
    let filters = {};
    if (category) {
      filters.category = category;
    }
    const products = await Product.find(filters);
    return products;
  } catch (e) {
    throw new Error(e);
  }
};

const addProduct = async (name, description, price, category) => {
  //create product
  const newProduct = new Product({
    name,
    description,
    price,
    category,
  });
  await newProduct.save();
  return newProduct;
};

const updateProduct = async (
  product_id,
  name,
  description,
  price,
  category
) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    product_id,
    {
      name,
      description,
      price,
      category,
    },
    { new: true }
  );
  return updatedProduct;
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
};
