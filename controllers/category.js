const Product = require("../models/product");

const getCategories = async () => {
  let categories = [];
  const products = await Product.find();
  products.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });
  return categories;
};

module.exports = {
  getCategories,
};
