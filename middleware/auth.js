const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = require("../config");
const { getUserByEmail } = require("../controllers/user");
const isUserValid = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);
    console.log(decoded);
    // if user exist
    if (user) {
      // this is a valid user
      // pass the user object to the next function
      req.user = user;
      // trigger the next function
      next();
    } else {
      // this is not a valid user
      res
        .status(403)
        .send({ message: "You are not authorized to perform this action" });
    }

    // perform user validation
  } catch (error) {
    // error
    res
      .status(403)
      .send({ message: "You are not authorized to perform this action" });
  }
};

// validate if the logged in user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // perform user validation
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);

    // if user is an admin
    if (user && user.role === "admin") {
      // this is a valid user
      // pass the user object to the next function
      req.user = user;
      // trigger the next function
      next();
    } else {
      // this is not a valid user
      res.status(403).send({
        message: "You are not authorized to perform this action",
      });
    }
  } catch (error) {
    res.status(403).send({
      message: "You are not authorized to perform this action",
    });
  }
};

module.exports = {
  isUserValid,
  isAdmin,
};
