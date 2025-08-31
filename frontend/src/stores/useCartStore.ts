import { axiosInstance } from "@/lib/axios";
import type { CartItem } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface CartStore {
  cartItems: CartItem[];
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  deleteFromCart: (cartItemId: string) => Promise<void>;
  updateProductQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  isLoading: boolean;
}



export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  isLoading: false,
  fetchCartItems: async () => {
    try {
        set({ isLoading: true });
      const response = await axiosInstance.get("/cart");
      const cartItems: CartItem[] = response.data.products.map((p: any) => ({
        ...p.productId,
        quantity: p.quantity,
      }));
      set({ cartItems });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart items";
      toast.error(message);
    }finally{
        set({ isLoading: false });
    }
  },
  addToCart: async (productId: string) => {
    try {
        set({ isLoading: true });
      const response = await axiosInstance.post(`/cart/add/${productId}`);
      if (response.data.success) {
       
        const cartItems: CartItem[] = response.data.products.map((p: any) => ({
          ...p.productId,
          quantity: p.quantity,
        }));
        set({ cartItems });
        toast.success("Product added to cart");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add to cart";
      toast.error(message);
    }finally{
        set({ isLoading: false });
    }
  },
  deleteFromCart: async (cartItemId: string) => {
    try {
        set({isLoading:true})
      await axiosInstance.delete(`/cart/remove/${cartItemId}`);
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item._id !== cartItemId),
      }));
      toast.success("Product removed from cart");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete from cart";
      toast.error(message);
    }finally{
        set({ isLoading: false });
    }
  },
  updateProductQuantity: async (cartItemId: string, quantity: number) => {
    try {
        
      await axiosInstance.put(`/cart/update/${cartItemId}`, { quantity });
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        ),
      }));
      
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product quantity";
      toast.error(message);
    }
  },
}));
