import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, contactInfo, location } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (role && !["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (role === "seller") {
      if (
        !contactInfo?.phoneNo ||
        !contactInfo?.contactEmail ||
        !location?.city ||
        !location?.state ||
        !location?.country
      ) {
        return res.status(400).json({
          message:
            "Contact information (including phone number and contact email) and location are required for sellers.",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email === process.env.ADMIN_EMAIL;

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : role || "buyer",
    };

    if (role === "seller") {
      newUser.contactInfo = contactInfo;
      newUser.location = location;
    }

    const registeringUser = new User(newUser);
    await registeringUser.save();
    generateToken(registeringUser._id, isAdmin, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: registeringUser._id,
        name: registeringUser.name,
        email: registeringUser.email,
        role: registeringUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isAdmin = user.role === "admin";
 const token= generateToken(user._id, isAdmin, res);
  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return res.status(200).json({ message: "Logout successful", success: true });
};

export const checkAuth = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Authorized", user });
};
