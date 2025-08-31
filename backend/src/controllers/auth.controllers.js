import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [buyer, seller] }
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phoneNo: { type: string }
 *                   contactEmail: { type: string }
 *               location:
 *                 type: object
 *                 properties:
 *                   city: { type: string }
 *                   state: { type: string }
 *                   country: { type: string }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 *       500: { description: Server error }
 */
export const signup = async (req, res) => {
  const { name, email, password, role, contactInfo, location } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email, and password are required" });
  }

  if (role && !["buyer", "seller"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role specified" });
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
        success: false,
        message:
          "Contact information (including phone number and contact email) and location are required for sellers.",
      });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
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
    success: true,
    message: "User registered successfully",
    user: {
      _id: registeringUser._id,
      name: registeringUser.name,
      email: registeringUser.email,
      role: registeringUser.role,
    },
  });
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       400: { description: Missing email or password }
 *       401: { description: Invalid credentials }
 *       404: { description: User not found }
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const isAdmin = user.role === "admin";
  const token = generateToken(user._id, isAdmin, res);
  return res.status(200).json({
    success: true,
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logout successful }
 */
export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return res.status(200).json({ success: true, message: "Logout successful" });
};

/**
 * @swagger
 * /auth/check:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User is authenticated }
 *       401: { description: Unauthorized }
 */
export const checkAuth = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Authorized", user });
};
