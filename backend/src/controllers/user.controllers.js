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
 * /users/orders:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       404:
 *         description: User not found
 */
export const getUserOrders = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("orders");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user.orders);
};
