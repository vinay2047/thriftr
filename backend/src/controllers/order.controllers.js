import { Order } from "../models/order.model.js";

export const getOrderById=async(req,res)=>{
  const {orderId}=req.params;
  const order=await Order.findById(orderId)
    .populate("buyerId","name email")
    .populate("sellerId","name email")
    .populate({
      path:"products.productId",
      select:"title images price"
    });
  res.status(200).json(order);
};

export const getAllOrders=async(req,res)=>{
  const orders=await Order.find({})
    .populate("buyerId","name email")
    .populate("sellerId","name email")
    .populate({
      path:"products.productId",
      select:"title images price"
    });
  res.status(200).json(orders);
};

export const createOrder=async(req,res)=>{
  const {sellerId,products,subtotal}=req.body;
  const buyerId=req.user._id;
  const newOrder=new Order({buyerId,sellerId,products,subtotal});
  await newOrder.save();
  const order=await Order.findById(newOrder._id)
    .populate("buyerId","name email")
    .populate("sellerId","name email")
    .populate({
      path:"products.productId",
      select:"title images price"
    });
  res.status(201).json({message:"Order created successfully",order});
};
