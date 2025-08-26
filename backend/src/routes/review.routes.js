import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProductReview, deleteProductReview,getProductReviews} from "../controllers/review.controller.js";

const router = Router();

router.get("/:productId",getProductReviews);
router.post("/",protectRoute,createProductReview);
router.delete("/:reviewId",protectRoute,deleteProductReview);

export default router;
