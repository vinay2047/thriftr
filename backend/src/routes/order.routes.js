import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/",protectRoute,getAllOrders);
router.get("/:orderId",protectRoute,getOrderById);


export default router;