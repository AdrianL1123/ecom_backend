const { BILLPLZ_X_SIGNATURE } = require("../config");
const Order = require("../models/order");
const crypto = require("crypto");

const verifyPayment = async (
  billplz_id,
  billplz_paid,
  billplz_paid_at,
  billplz_x_signature
) => {
  //* verify the signature
  const billplz_string = `billplzid${billplz_id}|billplzpaid_at${billplz_paid_at}|billplzpaid${billplz_paid}`;
  const x_signature = crypto
    .createHmac("sha256", BILLPLZ_X_SIGNATURE)
    .update(billplz_string)
    .digest("hex");

  //* compare the x signature with the one from billplz
  if (x_signature !== billplz_x_signature) {
    throw new Error("Touch Grass plz");
  } else {
    //* if signature is correct, update the order status and also payment date
    //* find the order using the billplz id
    const order = await Order.findOne({ billplz_id: billplz_id });
    //* check if order exists
    if (!order) {
      throw new Error("Order not found.");
    } else {
      //* if order is findOneAndUpdate, update the order
      order.status = billplz_paid === "true" ? "paid" : "failed";
      order.paid_at = billplz_paid_at;
      //* save the order
      return await order.save();
    }
  }
};

module.exports = {
  verifyPayment,
};
