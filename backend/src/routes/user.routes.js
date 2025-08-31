import { Router } from "express";
import {updateUser,getUser,getUserLikes,getUserListings } from "../controllers/user.controllers.js";
import { isSeller, protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.patch("/update",protectRoute,updateUser);
router.get('/me',protectRoute,getUser);
router.get('/likes',protectRoute,getUserLikes);
router.get('/listings',protectRoute,isSeller,getUserListings);

export default router;