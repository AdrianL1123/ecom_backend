/*
    getOrders
    getOrder
    addNewOrder
    updateOrder
    deleteOrder

*/
const axios = require("axios");
const { FRONTEND_URL } = require("../config");
//load all models
const Order = require("../models/order");

//load data from config
const {
  BILLPLZ_API_URL,
  BILLPLZ_API_KEY,
  BILLPLZ_COLLECTION_ID,
} = require("../config");

//get orders
const getOrders = async (user) => {
  try {
    let filters = {};
    // only filter by customerEmail if the user is a normal user
    if (user && user.role === "user") {
      filters.customerEmail = user.email;
    }
    const orders = await Order.find(filters).sort({ _id: -1 });
    return orders;
  } catch (error) {
    throw new Error(error);
  }
};

//get 1 order
const getOrder = async (id) => {
  try {
    return await Order.findById(id);
  } catch (error) {
    throw new Error(error);
  }
};

// addNewOrder
const addNewOrder = async (
  customerName,
  customerEmail,
  products,
  totalPrice,
  status
) => {
  // 1. create a bill in billplz
  const billplz = await axios({
    method: "POST",
    url: BILLPLZ_API_URL + "v3/bills",
    auth: {
      username: BILLPLZ_API_KEY,
      password: "",
    },
    data: {
      collection_id: BILLPLZ_COLLECTION_ID,
      email: customerEmail,
      name: customerName,
      amount: parseFloat(totalPrice) * 100,
      description: "Payment for order",
      callback_url: FRONTEND_URL + "verify-payment",
      redirect_url: FRONTEND_URL + "verify-payment",
    },
  });

  // 2. retrieve the bill_url and bill id
  const billplz_id = billplz.data.id;
  const billplz_url = billplz.data.url;

  // 3. create a new order
  const newOrder = new Order({
    customerName,
    customerEmail,
    products,
    totalPrice,
    status,
    billplz_id,
  });
  await newOrder.save();
  return {
    ...newOrder,
    billplz_url: billplz_url,
  };
};

// update order
const updateOrder = async (
  order_id,
  customerName,
  customerEmail,
  products,
  totalPrice,
  status,
  billplz_id,
  paid_at
) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      {
        customerName,
        customerEmail,
        products,
        totalPrice,
        status,
        billplz_id,
        paid_at,
      },
      {
        new: true,
      }
    );
    return updatedOrder;
  } catch (error) {
    throw new Error(error);
  }
};

// delete order
const deleteOrder = async (id) => {
  try {
    await Order.findByIdAndDelete(id);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getOrders,
  getOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
};
