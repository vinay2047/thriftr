import { Cart } from "../models/cart.model.js";
export const getCartItems=async(req,res)=>{
    const userId=req.user._id;
    const cart=await Cart.findOne({userId});
    if(!cart) if(!cart)return res.status(200).json({ products: [] });
    res.status(200).json({products:cart.products});
}
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity }] });
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }
  await cart.save();
  res.status(200).json({products:cart.products});
};
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(200).json({ producrts:[] });
  cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  res.status(200).json({prodcts:cart.products});
};

export const updateQuantity=async (req, res) => {
  const {productId,quantity} = req.body;
  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(200).json({ products: [] });
  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (productIndex === -1)
    return res.status(404).json({ message: "Product not in cart" });
  cart.products[productIndex].quantity = quantity;
  await cart.save();
  res.status(200).json({products:cart.products});
};