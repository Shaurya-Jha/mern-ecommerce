// authentication
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// authenticate the user - check creds and token for login and logout
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // read jwt from 'jwt' cookie
  token = req.cookies.jwt; // requesting cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401).send("Not authorized, token failed");
    }
  } else {
    res.status(401).send("Not authorized, no token");
  }
});

// check for the admin if the user is admim
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as admin");
  }
};

export { authenticate, authorizeAdmin };
