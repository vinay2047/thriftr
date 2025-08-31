import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import NodeCache from "node-cache";

const idempotencyCache = new NodeCache({ stdTTL: 300 });

function signResponse(body, seed) {
  return crypto
    .createHmac("sha256", seed)
    .update(JSON.stringify(body))
    .digest("hex");
}

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
 *       404:
 *         description: Order not found
 */
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;
  let query = { _id: orderId };

  if (user.role === "buyer") query.buyerId = user._id;
  if (user.role === "seller") query.sellerIds = user._id;

  const order = await Order.findOne(query)
    .populate("buyerId", "name email contactInfo.phoneNo contactInfo.contactEmail location")
    .populate({
      path: "products.productId",
      select: "title images price SKU sellerId",
      populate: {
        path: "sellerId",
        select: "name email contactInfo.phoneNo contactInfo.contactEmail location",
      },
    });

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
  if (user.role === "seller") filter.sellerIds = user._id;

  const orders = await Order.find(filter)
    .populate("buyerId", "name email contactInfo.phoneNo contactInfo.contactEmail location")
    .populate({
      path: "products.productId",
      select: "title images price SKU sellerId",
      populate: {
        path: "sellerId",
        select: "name email contactInfo.phoneNo contactInfo.contactEmail location",
      },
    });

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
 *               - sellerIds
 *               - products
 *               - subtotal
 *             properties:
 *               sellerIds:
 *                 type: array
 *                 items:
 *                   type: string
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
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       403:
 *         description: Only buyers can create
 */
export const createOrder = async (req, res) => {
  const { sellerIds, products, subtotal, paymentStatus } = req.body;
  const buyerId = req.user._id;
  const idempotencyKey = req.headers["idempotency-key"];

  if (idempotencyKey) {
    const cached = idempotencyCache.get(idempotencyKey);
    if (cached) {
      const signature = signResponse(cached, process.env.ASSIGNMENT_SEED);
      res.set("X-Signature", signature);
      return res.status(200).json(cached);
    }
  }

  try {
    const newOrder = new Order({ buyerId, sellerIds, products, subtotal, paymentStatus });
    await newOrder.save();

    await User.findByIdAndUpdate(buyerId, { $push: { orders: newOrder._id } });
    await User.updateMany({ _id: { $in: sellerIds } }, { $push: { orders: newOrder._id } });

    const order = await Order.findById(newOrder._id)
      .populate({
        path: "products.productId",
        select: "title images price SKU sellerId",
        populate: {
          path: "sellerId",
          select: "name email contactInfo.phoneNo contactInfo.contactEmail location",
        },
      })
      .populate("buyerId", "name email contactInfo.phoneNo contactInfo.contactEmail location");

    const responseBody = { success: true, order };

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, responseBody);
    }

    const signature = signResponse(responseBody, process.env.ASSIGNMENT_SEED);
    res.set("X-Signature", signature);
    res.status(201).json(responseBody);
  } catch (err) {
    const responseBody = { success: false, message: "Failed to create order" };
    const signature = signResponse(responseBody, process.env.ASSIGNMENT_SEED);
    res.set("X-Signature", signature);
    res.status(500).json(responseBody);
  }
};
