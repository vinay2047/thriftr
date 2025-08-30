import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders, getOrderById, createOrder } from "../controllers/order.controllers.js";
const router = Router();

router.get("/",protectRoute,getAllOrders);
router.get("/:orderId",protectRoute,getOrderById);
router.post("/create",protectRoute,createOrder);

export default router;