import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sellerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
  products: [
      {
          productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
          },
          quantity: {
              type: Number,
              required: true,
          },
      },
  ],
   subtotal:{
       type: Number,
       required: true
   },
   paymentStatus:{
       type: String,
       enum: ['pending', 'completed',"failed"],
       default: 'pending',
   }

},{timestamps:true});

export const Order = mongoose.model("Order", orderSchema);