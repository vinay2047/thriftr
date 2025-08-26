import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

dotenv.config();

const API_URL = "http://localhost:3000/api";
const MONGODB_URI = process.env.MONGODB_URI;
const dummyImagePath = path.join(process.cwd(), "dummy.jpg");

// create an axios instance with cookie jar
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

const loginSeller = async (email, password = "password123") => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = res.data.token; // now this will be defined
    if (!token) throw new Error("No token returned from login");
    console.log(`Logged in seller: ${email}`);
    return token;
  } catch (err) {
    console.error(`Failed to login seller ${email}:`, err.response?.data || err.message);
    return null;
  }
};


const createProduct = async (token) => {
  const form = new FormData();
  form.append("title", faker.commerce.productName());
  form.append("description", faker.commerce.productDescription());
  form.append("price", faker.commerce.price());

  for (let i = 0; i < 3; i++) {
    form.append("images", fs.createReadStream(dummyImagePath));
  }

 await axios.post(`${API_URL}/product`, form, {
  headers: {
    ...form.getHeaders(),
    Authorization: `Bearer ${token}`, // use the token from login
  },
});

};



const seedProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const sellers = await User.find({ role: "seller" });
    if (!sellers.length) return console.log("No sellers found");

    for (const seller of sellers) {
  console.log(`Seeding products for seller: ${seller.email}`);
  const token = await loginSeller(seller.email); // get token
  if (!token) continue;

  const numProducts = faker.number.int({ min: 3, max: 6 });
  for (let i = 0; i < numProducts; i++) {
    await createProduct(token); // pass token here!
  }
}

    console.log("🎉 Product seeding complete");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedProducts();
