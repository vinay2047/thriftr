import { create } from "zustand";
import axios from "axios";

interface ProductItem {
  productId: string;
  quantity: number;
}

interface Order { /* same as before */ }

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (sellerId: string, products: ProductItem[], subtotal: number) => Promise<Order | null>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [], 
  selectedOrder: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("/orders", { withCredentials: true });
      set({ orders: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch orders", loading: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/orders/${orderId}`, { withCredentials: true });
      set({ selectedOrder: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch order", loading: false });
    }
  },

  createOrder: async (sellerId: string, products: ProductItem[], subtotal: number) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "/orders",
        { sellerId, products, subtotal },
        { withCredentials: true }
      );
      set((state) => ({ orders: [...state.orders, res.data], loading: false }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create order", loading: false });
      return null;
    }
  },
}));
