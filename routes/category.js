const express = require("express");
const router = express.Router();

const {
  getCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const { isAdmin } = require("../middleware/auth");

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

router.post("/", isAdmin, async (req, res) => {
  try {
    const name = req.body.name;
    const newCategory = await addNewCategory(name);
    res.status(200).send(newCategory);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const category_id = req.params.id;
    const name = req.body.name;
    const updatedCategory = await updateCategory(category_id, name);
    res.status(200).send(updatedCategory);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const category_id = req.params.id;
    const deletedCategory = await deleteCategory(category_id);
    res.status(200).send(deletedCategory);
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

module.exports = router;
