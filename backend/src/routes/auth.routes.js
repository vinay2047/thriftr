import { Router } from "express";
const router=Router();
import {signup,login,logout,checkAuth} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post('/signup',signup);
router.post('/login',login);
router.get('/logout',protectRoute,logout);
router.get('/check',protectRoute,checkAuth)
export default router;