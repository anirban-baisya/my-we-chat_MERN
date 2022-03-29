const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => { //next to move on the other operation
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") //if in req there is any token & it JWT token starts with Bearer 
  ) {
    try {
        //jwt token will look like this-      Bearer ssdsd dsfrffd
      token = req.headers.authorization.split(" ")[1]; //removing bearer from token

    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  //decodes token id

      req.user = await User.findById(decoded.id).select("-password");//find the user in databse & return it with out the password

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) { //if towen is not there
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };