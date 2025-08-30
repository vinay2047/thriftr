import { User } from "../models/user.model.js";

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile (contact info and location)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phoneNo:
 *                     type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Missing required fields
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
 *     summary: Get authenticated user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
          select: "title images  price SKU"
        }
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); 
  
};


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


