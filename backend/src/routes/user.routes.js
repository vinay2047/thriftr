import { Router } from "express";
import {updateUser,getUserOrders } from "../controllers/user.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.patch("/update",protectRoute,updateUser);
router.get('/orders',protectRoute,getUserOrders);


export default router;