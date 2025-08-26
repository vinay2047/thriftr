import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config();

const API_URL = "http://localhost:3000/api";
const MONGODB_URI = process.env.MONGODB_URI;

// Path to a dummy image (make sure it exists)
const dummyImagePath = path.join(process.cwd(), "dummy.jpg");

// Login seller and get JWT cookie
const loginSeller = async (email, password = "password123") => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );

    const cookies = res.headers["set-cookie"];
    if (!cookies) throw new Error("No cookies returned on login");

    return cookies.join("; "); // combine multiple cookies if any
  } catch (err) {
    console.error(`Failed to login seller ${email}:`, err.response?.data || err.message);
    return null;
  }
};

// Create product for a seller
const createProduct = async (cookieHeader) => {
  try {
    const form = new FormData();
    form.append("title", faker.commerce.productName());
    form.append("description", faker.commerce.productDescription());
    form.append("price", faker.commerce.price());

    // Attach 2–4 dummy images
    const numImages = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < numImages; i++) {
      form.append("images", fs.createReadStream(dummyImagePath));
    }

    await axios.post(`${API_URL}/product`, form, {
      headers: {
        ...form.getHeaders(),
        Cookie: cookieHeader,
      },
      withCredentials: true,
    });

    console.log(`✅ Product created with ${numImages} images`);
  } catch (err) {
    console.error("❌ Failed to create product:", err.response?.data || err.message);
  }
};

// Seed products for all sellers
const seedProducts = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);

    console.log("Fetching sellers...");
    const sellers = await User.find({ role: "seller" });

    if (!sellers.length) {
      console.log("No sellers found. Add sellers first.");
      return;
    }

    for (const seller of sellers) {
      console.log(`Seeding products for seller: ${seller.email}`);
      const cookieHeader = await loginSeller(seller.email);
      if (!cookieHeader) continue;

      const numProducts = faker.number.int({ min: 3, max: 6 });
      for (let i = 0; i < numProducts; i++) {
        await createProduct(cookieHeader);
      }
    }

    console.log("🎉 Product seeding complete.");
  } catch (err) {
    console.error("Error during product seeding:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedProducts();
