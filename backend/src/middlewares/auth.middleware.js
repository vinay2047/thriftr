
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";



export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No Token Provided" });
        }
        let isVerified;
        try {
            isVerified= jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            try {
                isVerified = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            } catch (adminErr) {
                return res.status(401).json({ message: "Unauthorized: Invalid Token" });
            }
        }
        const user = await User.findById(isVerified.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
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


