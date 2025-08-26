import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products list
 */
export const getAllProducts=async(req,res)=>{
  const products=await Product.find({});
  res.status(200).json(products);
};

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
export const getProductById=async(req,res)=>{
  const {productId}=req.params;
  const product=await Product.findById(productId).populate(["sellerId","reviews"]);
  res.status(200).json(product);
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (seller only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
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

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update product (seller only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete product (seller only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 */
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
