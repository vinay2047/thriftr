import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 *       404:
 *         description: Product not found
 */
export const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({ message: "Product not found" });
    const reviews = await Review.find({ productId }).populate({path: "authorId", select: "-password -__v"});
    res.status(200).json(reviews);
}

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - review
 *               - productId
 *             properties:
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Already reviewed
 *       404:
 *         description: Product not found
 */
export const createProductReview = async (req, res) => {
  const { rating, review, productId } = req.body;
  const userId = req.user._id;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existingReview = await Review.findOne({ productId, authorId: userId });
  if (existingReview) return res.status(400).json({ message: "You have already reviewed this product" });

  const newReview = new Review({ authorId: userId, productId, rating, review });
  await newReview.save();

  const reviewCount = product.reviewCount + 1;
  const totalRating = product.averageRating * product.reviewCount + rating;
  product.averageRating = totalRating / reviewCount;
  product.reviewCount = reviewCount;
  await product.save();

  res.status(201).json({ message: "Review created successfully", review: newReview });
};

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review (author or admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
export const deleteProductReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.authorId.toString() !== userId.toString() && req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized to delete this review" });

  const product = await Product.findById(review.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await review.deleteOne();

  if (product.reviewCount > 1) {
    const totalRating = product.averageRating * product.reviewCount - review.rating;
    product.reviewCount -= 1;
    product.averageRating = totalRating / product.reviewCount;
  } else {
    product.reviewCount = 0;
    product.averageRating = 0;
  }

  await product.save();
  res.status(200).json({ success: true, message: "Review deleted successfully" });
};
