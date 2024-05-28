const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_PRIVATE_KEY } = require("../config");
const getUserByEmail = async (email) => {
  //* find one user with the provided email
  const user = await User.findOne({ email: email });
  return user;
};

const generateTokenForUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_PRIVATE_KEY,
    {
      expiresIn: "30d", // 30 days
    }
  );
};

//* login user
const loginUser = async (email, password) => {
  //* 1. check if user exists or not
  const user = await getUserByEmail(email);

  //* 2. if user dont exists, return error
  if (!user) {
    throw new Error("Invalid email or password");
  }
  //* 3. Check if password match or not
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }
  //* 4. set up jwt token
  const token = generateTokenForUser(user);
  //* 5. return back the user data
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };
};

//* create user
const signUpUser = async (name, email, password) => {
  //* 1. check if email is already exists or not
  const emailExist = await getUserByEmail(email);
  if (emailExist) {
    throw new Error("Email already exists");
  }
  //* 2. Create the new user
  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10), // hash password
  });
  //* 3. Save the data
  await newUser.save();
  //* 4. generate token
  const token = generateTokenForUser(newUser);
  //* 5. Return the user data
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: token,
  };
};

module.exports = {
  getUserByEmail,
  loginUser,
  signUpUser,
};
