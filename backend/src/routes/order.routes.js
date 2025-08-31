import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders, getOrderById, createOrder } from "../controllers/order.controllers.js";
import { checkoutLimiter } from "../lib/rateLimiter.js";
const router = Router();

router.get("/",protectRoute,getAllOrders);
router.get("/:orderId",protectRoute,getOrderById);
router.post("/checkout",protectRoute,checkoutLimiter,createOrder);

export default router;