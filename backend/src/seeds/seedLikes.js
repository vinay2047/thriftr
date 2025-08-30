import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/thriftr";

async function seedLikes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch all buyers
    const buyers = await User.find({ role: "buyer" });
    if (!buyers.length) {
      console.log("No buyers found");
      return;
    }

    // Fetch all products
    const products = await Product.find();
    if (!products.length) {
      console.log("No products found");
      return;
    }

    for (const buyer of buyers) {
      // Pick 3-5 random products for each buyer
      const shuffled = products.sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);

      const productIds = selectedProducts.map(p => p._id);

      // Update buyer's likes
      buyer.likes = Array.from(new Set([...buyer.likes, ...productIds]));
      await buyer.save();

      // Increment likeCount for each selected product
      for (const product of selectedProducts) {
        product.likeCount += 1;
        await product.save();
      }

      console.log(`Added ${productIds.length} likes for buyer: ${buyer.name}`);
    }

    console.log("Seeding complete");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedLikes();
