const express = require("express");
const { loginUser, signUpUser } = require("../controllers/user");
const router = express.Router();

//* /login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // login user via loginUser()
    const user = await loginUser(email, password);
    // send back the newly create user data
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

//* /signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // create user via signUpUser()
    const user = await signUpUser(name, email, password);
    // send back the newly create user data
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
