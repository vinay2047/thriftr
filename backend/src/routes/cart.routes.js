import { Router } from "express";
import { getCartItems,addToCart,removeFromCart,updateQuantity } from "../controllers/cart.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/",protectRoute,getCartItems);
router.post("/add",protectRoute,addToCart);
router.delete("/remove",protectRoute,removeFromCart);
router.put("/update",protectRoute,updateQuantity);

export default router;