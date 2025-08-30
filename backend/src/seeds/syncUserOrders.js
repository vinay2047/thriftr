import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/thriftr";

async function syncOrders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const orders = await Order.find();
    console.log(`📦 Found ${orders.length} orders`);

    for (const order of orders) {
      const { buyerId, sellerId, _id } = order;

      // Update buyer
      if (buyerId) {
        await User.findByIdAndUpdate(
          buyerId,
          { $addToSet: { orders: _id } }, // $addToSet prevents duplicates
          { new: true }
        );
      }

      // Update seller
      if (sellerId) {
        await User.findByIdAndUpdate(
          sellerId,
          { $addToSet: { orders: _id } },
          { new: true }
        );
      }
    }

    console.log("✅ Synced all orders to users");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing orders:", err);
    process.exit(1);
  }
}

syncOrders();
