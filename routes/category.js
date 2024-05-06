const express = require("express");
const router = express.Router();

const { getCategories } = require("../controllers/category");

router.get("/", async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).send(categories);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

module.exports = router;
