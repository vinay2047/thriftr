import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProductReview, deleteProductReview} from "../controllers/review.controller.js";

const router = Router();

router.post("/",protectRoute,createProductReview);
router.delete("/:reviewId",protectRoute,deleteProductReview);

export default router;
