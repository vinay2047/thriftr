import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateSKU } from "../lib/skuGenerator.js";

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (with filters & pagination)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 12, search, category, minPrice, maxPrice, sort } = req.query;
  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortOption = {};
  switch (sort) {
    case "price-low-high": sortOption.price = 1; break;
    case "price-high-low": sortOption.price = -1; break;
    case "popular": sortOption.likeCount = -1; break;
    default: sortOption.createdAt = -1; break;
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    products,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
  });
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
export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate({
    path: "sellerId",
    select: "name contactInfo location",
  });
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
 *     responses:
 *       201:
 *         description: Product created
 */
export const createProduct = async (req, res) => {
  const { title, description, price, category } = req.body;
  const newProduct = new Product({
    title,
    description,
    price,
    category,
    sellerId: req.user._id,
    images: req.files ? req.files.map(f => ({ url: f.path, filename: f.filename })) : [],
  });
  newProduct.SKU = generateSKU(newProduct._id.toString());
  await newProduct.save();
  res.status(201).json({ message: "Product created successfully", product: newProduct });
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
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    const { title, description, price, category } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized" });

    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
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
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.sellerId.toString() !== userId.toString())
    return res.status(403).json({ message: "Not authorized" });

  for (let img of product.images) {
    await cloudinary.uploader.destroy(img.filename);
  }
  await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "Product deleted successfully" });
};

/**
 * @swagger
 * /products/{productId}/like:
 *   patch:
 *     summary: Toggle like on a product
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
 *         description: Product liked or unliked
 *       404:
 *         description: Product not found
 */
export const toggleLike = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    let product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let message;
    if (user.likes.includes(product._id)) {
      await user.updateOne({ $pull: { likes: product._id } });
      await product.updateOne({ $inc: { likeCount: -1 } });
      message = "Product unliked";
    } else {
      await user.updateOne({ $push: { likes: product._id } });
      await product.updateOne({ $inc: { likeCount: 1 } });
      message = "Product liked";
    }

    product = await Product.findById(productId);
    const updatedUser = await User.findById(userId);
    const isLiked = updatedUser.likes.includes(product._id);

    res.status(200).json({ message, product, isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
