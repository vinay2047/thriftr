import { Cart } from "../models/cart.model.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CartProduct:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         quantity:
 *           type: integer
 *         productId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             price:
 *               type: number
 *             category:
 *               type: string
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartProduct'
 */
export const getCartItems = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart) return res.status(200).json({ products: [] });
  res.status(200).json({ products: cart.products });
};

/**
 * @swagger
 * /cart/{productId}:
 *   post:
 *     summary: Add a new product to the cart
 *     description: Adds a product to the user's cart with a default quantity of 1. 
 *                  If the product is already in the cart, a 400 error is returned.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to add to the cart
 *     responses:
 *       200:
 *         description: Product successfully added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartProduct'
 *       400:
 *         description: Product is already in the cart
 */
export const addToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
  } else {
    const productExists = cart.products.some(
      (item) => item.productId.toString() === productId
    );
    if (productExists) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in cart" });
    }
    cart.products.push({ productId, quantity: 1 });
  }

  await cart.save();
  await cart.populate("products.productId");
  res.status(200).json({ success: true, products: cart.products });
};

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from the cart
 *     responses:
 *       200:
 *         description: Product removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartProduct'
 */
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(200).json({ products: [] });

  cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  await cart.populate("products.productId");
  res.status(200).json({ products: cart.products });
};

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update in the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartProduct'
 *       404:
 *         description: Product not in cart
 */
export const updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(200).json({ products: [] });

  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (productIndex === -1)
    return res.status(404).json({ message: "Product not in cart" });

  cart.products[productIndex].quantity = quantity;
  await cart.save();
  await cart.populate("products.productId");
  res.status(200).json({ products: cart.products });
};
