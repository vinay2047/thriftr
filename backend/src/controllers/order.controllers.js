import { Order } from "../models/order.model.js";

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get an order by ID (buyer/seller restricted)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 buyerId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     contactInfo:
 *                       type: string
 *                     location:
 *                       type: string
 *                 sellerId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     contactInfo:
 *                       type: string
 *                     location:
 *                       type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 url:
 *                                   type: string
 *                                 filename:
 *                                   type: string
 *                           price:
 *                             type: number
 *                           SKU:
 *                             type: string
 *                       quantity:
 *                         type: number
 *                 subtotal:
 *                   type: number
 *                 paymentStatus:
 *                   type: string
 *       404:
 *         description: Order not found
 */
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;
  let query = { _id: orderId };

  if (user.role === "buyer") query.buyerId = user._id;
  if (user.role === "seller") query.sellerId = user._id;

  const order = await Order.findOne(query)
    .populate("buyerId", "name contactInfo location")
    .populate("sellerId", "name contactInfo location")
    .populate({ path: "products.productId", select: "title images price SKU" });

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.status(200).json(order);
};

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for logged in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
 */
export const getAllOrders = async (req, res) => {
  const user = req.user;
  let filter = {};
  if (user.role === "buyer") filter.buyerId = user._id;
  if (user.role === "seller") filter.sellerId = user._id;
  const orders = await Order.find(filter)
    .populate("buyerId", "name email")
    .populate("sellerId", "name email")
    .populate({ path: "products.productId", select: "title images price" });
  res.status(200).json(orders);
};

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (only buyers)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - products
 *               - subtotal
 *             properties:
 *               sellerId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               subtotal:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created
 *       403:
 *         description: Only buyers can create
 */
export const createOrder = async (req, res) => {
  const { sellerId, products, subtotal,paymentStatus } = req.body;
  const buyerId = req.user._id;

  const newOrder = new Order({ buyerId, sellerId, products, subtotal,paymentStatus });
  await newOrder.save();

  const order = await Order.findById(newOrder._id)
    .populate("sellerId", "name email")
    .populate({ path: "products.productId", select: "title images price" });

  res.status(201).json(order);
};
