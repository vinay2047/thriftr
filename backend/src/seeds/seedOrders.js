import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/thriftr"; // adjust db name

async function seedOrders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // Clear old orders first
    await Order.deleteMany({});
    console.log("🗑️ Deleted existing orders");

    // Fetch all buyers, sellers, and products
    const buyers = await User.find({ role: "buyer" });
    const sellers = await User.find({ role: "seller" });
    const products = await Product.find();

    if (!buyers.length || !sellers.length || !products.length) {
      console.log("❌ Need buyers, sellers, and products in DB before seeding orders");
      process.exit(0);
    }

    const ordersToInsert = [];

    // Create 10 orders
    for (let i = 0; i < 10; i++) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
     
      const productCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order

      const chosenProducts = [];
      let subtotal = 0;
      const sellerIdSet = new Set();

      for (let j = 0; j < productCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // quantity 1–3

        chosenProducts.push({
          productId: product._id,
          quantity,
        });

        subtotal += product.price * quantity;

        if (product.sellerId) {
          sellerIdSet.add(product.sellerId.toString());
        }
      }

      const order = {
        buyerId: buyer._id,
        sellerIds: Array.from(sellerIdSet),
        products: chosenProducts,
        subtotal,
        paymentStatus: "pending",
      };

      ordersToInsert.push(order);
    }

    await Order.insertMany(ordersToInsert);

    console.log(`✅ Seeded ${ordersToInsert.length} new orders`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding orders:", err);
    process.exit(1);
  }
}

seedOrders();
