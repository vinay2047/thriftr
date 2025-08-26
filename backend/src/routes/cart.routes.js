import { Router } from "express";
import { getCartItems,addToCart,removeFromCart,updateQuantity } from "../controllers/cart.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/",protectRoute,getCartItems);
router.post("/",protectRoute,addToCart);
router.delete("/",protectRoute,removeFromCart);
router.put("/",protectRoute,updateQuantity);

export default router;