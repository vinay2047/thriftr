import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllProducts=async(req,res)=>{
  const products=await Product.find({});
  res.status(200).json(products);
};

export const getProductById=async(req,res)=>{
  const {productId}=req.params;
  const product=await Product.findById(productId).populate("sellerId,reviews");
  res.status(200).json(product);
};

export const createProduct=async(req,res)=>{
  const {title,description,price}=req.body;
  const newProduct=new Product({
    title,
    description,
    price,
    sellerId:req.user._id,
    images:req.files?req.files.map(f=>({url:f.path,filename:f.filename})):[]
  });
  await newProduct.save();
  res.status(201).json({message:"Product created successfully",product:newProduct});
};

export const updateProduct=async(req,res)=>{
  const {productId}=req.params;
  const userId=req.user._id;
  const {price}=req.body;
  const product=await Product.findById(productId);
  if(!product)return res.status(404).json({message:"Product not found"});
  if(product.sellerId.toString()!==userId.toString())return res.status(403).json({message:"Not authorized"});
  if(req.files&&req.files.length>0){
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    product.images.push(...imgs);
  }
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
  }
  if(price)product.price=price;
  await product.save();
  res.status(200).json({message:"Product updated successfully",product});
};

export const deleteProduct=async(req,res)=>{
  const {productId}=req.params;
  const userId=req.user._id;
  const product=await Product.findById(productId);
  if(!product)return res.status(404).json({message:"Product not found"});
  if(product.sellerId.toString()!==userId.toString())return res.status(403).json({message:"Not authorized"});
  for(let img of product.images){
    await cloudinary.uploader.destroy(img.filename);
  }
  await Product.findByIdAndDelete(productId);
  res.status(200).json({message:"Product deleted successfully"});
};
