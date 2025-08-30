import { Router } from "express";
import {updateUser,getUser } from "../controllers/user.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.patch("/update",protectRoute,updateUser);
router.get('/me',protectRoute,getUser);


export default router;