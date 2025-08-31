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

    // Clear orders array for all users first
    await User.updateMany({}, { $set: { orders: [] } });
    console.log("🗑️ Cleared orders array for all users");

    const orders = await Order.find();
    console.log(`📦 Found ${orders.length} orders`);

    for (const order of orders) {
      const { buyerId, sellerIds, _id } = order;

      // Update buyer
      if (buyerId) {
        await User.findByIdAndUpdate(
          buyerId,
          { $addToSet: { orders: _id } },
          { new: true }
        );
      }

      // Update all sellers
      if (Array.isArray(sellerIds)) {
        for (const sellerId of sellerIds) {
          await User.findByIdAndUpdate(
            sellerId,
            { $addToSet: { orders: _id } },
            { new: true }
          );
        }
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
