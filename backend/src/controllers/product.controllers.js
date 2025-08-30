import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateSKU } from "../lib/skuGenerator.js";
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (paginated, with filters)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Electronics, Clothing, Books, Home, Furniture, Sports, Toys, Health, Beauty, Grocery, Jewelry, Automotive, Other]
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: Paginated products list
 */
export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 12, search, category, minPrice, maxPrice } = req.query;

  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter)
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
  const product = await Product.findById(productId).populate({path: "sellerId",
    select: "-password -__v"})
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
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [Electronics, Clothing, Books, Home, Furniture, Sports, Toys, Health, Beauty, Grocery, Jewelry, Automotive, Other]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 */
export const createProduct = async (req, res) => {
  const { title, description, price, category } = req.body
  const newProduct = new Product({
    title,
    description,
    price,
    category,
    sellerId: req.user._id,
    images: req.files ? req.files.map(f => ({ url: f.path, filename: f.filename })) : []
  })

 
  newProduct.SKU = generateSKU(newProduct._id.toString())

  await newProduct.save()
  res.status(201).json({ message: "Product created successfully", product: newProduct })
}


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
  const { productId } = req.params;
  const userId = req.user._id;
  const { price, category } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.sellerId.toString() !== userId.toString()) return res.status(403).json({ message: "Not authorized" });

  if (req.files && req.files.length > 0) {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
  }

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }

  if (price) product.price = price;
  if (category) product.category = category;
  await product.save();

  res.status(200).json({ message: "Product updated successfully", product });
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
  if (product.sellerId.toString() !== userId.toString()) return res.status(403).json({ message: "Not authorized" });

  for (let img of product.images) {
    await cloudinary.uploader.destroy(img.filename);
  }
  await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "Product deleted successfully" });
};
