
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
     return res.status(401).json({ message: "Unauthorized- No token provided" });
    }
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (!isVerified) {
       const isAdmin = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      if(!isAdmin){

          return res.status(401).json({ message: "Unauthorized- Invalid token" });
      }
      user = await User.findById(isAdmin.userId).select("-password");
    }
    user = await User.findById(isVerified.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized- Not an admin" });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user.role === "seller") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized- Not a seller" });
  }
};


