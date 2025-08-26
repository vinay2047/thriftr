import { Cart } from "../models/cart.model.js";

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
 *                     type: object
 */
export const getCartItems=async(req,res)=>{
    const userId=req.user._id;
    const cart=await Cart.findOne({userId});
    if(!cart) return res.status(200).json({ products: [] });
    res.status(200).json({products:cart.products});
}

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added/updated in cart
 */
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity }] });
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }
  await cart.save();
  res.status(200).json({products:cart.products});
};

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Product not found in cart
 */
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(200).json({ producrts:[] });
  cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  res.status(200).json({products:cart.products});
};

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated
 *       404:
 *         description: Product not in cart
 */
export const updateQuantity=async (req, res) => {
  const {productId,quantity} = req.body;
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
  res.status(200).json({products:cart.products});
};
