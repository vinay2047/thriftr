import { Router } from "express";
import { getProductById,getAllProducts,createProduct,updateProduct,deleteProduct, toggleLike } from "../controllers/product.controllers.js";
import { protectRoute,isSeller } from "../middlewares/auth.middleware.js";
import { upload } from "../lib/cloudinary.js";
const router = Router();

router.get("/",getAllProducts);
router.get("/:productId",getProductById);
router.post("/create",protectRoute,isSeller,upload.array("images",3),createProduct);
router.post("/like/:productId",protectRoute,toggleLike);
router.put("/update/:productId",protectRoute,isSeller,updateProduct);
router.delete("/:productId",protectRoute,isSeller,deleteProduct);

export default router;