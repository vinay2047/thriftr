import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Missing fields
 *       404:
 *         description: User not found
 */
export const updateUser = async (req, res) => {
  const { contactInfo, location } = req.body;
  const userId = req.user._id;

  if (
    !contactInfo ||
    !location ||
    !contactInfo.phoneNo ||
    !location.city ||
    !location.state ||
    !location.country
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { contactInfo, location },
    { new: true }
  );

  return res.status(200).json(updatedUser);
};

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export const getUser = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate({ path: "likes", select: "title images likeCount price" })
    .populate({
      path: "orders",
      select: "products subtotal paymentStatus createdAt",
      populate: {
        path: "products.productId",
        select: "title images price SKU",
      },
    });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};

/**
 * @swagger
 * /users/likes:
 *   get:
 *     summary: Get user likes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked products
 *       404:
 *         description: User not found
 */
export const getUserLikes = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.likes);
  } catch (err) {
    console.error("Error in getUserLikes:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /users/listings:
 *   get:
 *     summary: Get user listings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user listings
 *       404:
 *         description: User not found
 */
export const getUserListings = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const listings = await Product.find({ sellerId: userId });
    return res.status(200).json(listings);
  } catch (err) {
    console.error("Error in getUserListings:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
