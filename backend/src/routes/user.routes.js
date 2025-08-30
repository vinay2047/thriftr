import { Router } from "express";
import {updateUser,getUser,getUserLikes } from "../controllers/user.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.patch("/update",protectRoute,updateUser);
router.get('/me',protectRoute,getUser);
router.get('/likes',protectRoute,getUserLikes);

export default router;