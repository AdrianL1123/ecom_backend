const express = require("express");
const router = express.Router();

const { verifyPayment } = require("../controllers/payment");

//* router for payment verification
router.post("/", async (req, res) => {
  try {
    const { billplz_id, billplz_paid, billplz_paid_at, billplz_x_signature } =
      req.body;
    const order = await verifyPayment(
      billplz_id,
      billplz_paid,
      billplz_paid_at,
      billplz_x_signature
    );
    res.status(200).send(order);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
