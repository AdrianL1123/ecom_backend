const Product = require("../models/product");

const getProducts = async (category, perPage = 4, page = 1) => {
  try {
    let filters = {};
    if (category) {
      filters.category = category;
    }
    /* 
     Pagination
      .limit() //* limit the amount of items returned
      .skip() //* skip given amount
    */

    const products = await Product.find(filters)
      .populate("category")
      .limit(6)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    return products;
  } catch (e) {
    throw new Error(e);
  }
};

const getProduct = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error(error);
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
  category,
  image
) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    product_id,
    {
      name,
      description,
      price,
      category,
      image,
    },
    { new: true }
  );
  return updatedProduct;
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
};
