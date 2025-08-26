
import jwt from "jsonwebtoken"
export const generateToken = (userId,isAdmin,res) => {
  
  const token = jwt.sign({userId},isAdmin?process.env.ADMIN_JWT_SECRET: process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
 
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite:"strict",
    secure: process.env.NODE_ENV !== "development",

  });
  return token;
};