import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// hashing password library
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // validation for checking these fields before sending data to database
  if (!username || !email || !password) {
    throw new Error("Please fill all inputs");
  }

  // check for already existing email
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
  }

  // hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create a user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400).send("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      // generate a token as a cookie
      createToken(res, existingUser);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });

      return; // exit the function after sending the response
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "logged out successfully",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {

    // empty find object will find all the data from the database
    const users = await User.find({});

    res.json(users);
})

export { createUser, loginUser, logoutCurrentUser, getAllUsers };
