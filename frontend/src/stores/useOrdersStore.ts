import { create } from "zustand";

import { axiosInstance } from "@/lib/axios";

interface ProductItem {
  productId: {
 
    title: string;
    price: number;
    images: { url: string; filename: string }[];
    buyerId: {
      email: string;
      name: string;
    }
    sellerId: {
      email: string;
      name: string;
    }
    SKU:string
  };
  quantity: number;
}

interface Order { 
  _id: string;
  buyerId: string;
  sellerId: string;
  products: ProductItem[];
  subtotal: number;
  paymentStatus: string;
 }

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (sellerId: string, products: ProductItem[], subtotal: number,paymentStatus: string) => Promise<Order | null>;
}

export const useOrdersStore = create<OrderStore>((set) => ({
  orders: [], 
  selectedOrder: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/orders");
      set({ orders: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch orders", loading: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`/orders/${orderId}`);
      set({ selectedOrder: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch order", loading: false });
    }
  },

  createOrder: async (sellerId: string, products: ProductItem[], subtotal: number,paymentStatus: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post(
        "/orders/create",
        { sellerId, products, subtotal,paymentStatus }
      );
      set((state) => ({ orders: [...state.orders, res.data], loading: false }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create order", loading: false });
      return null;
    }
  },
}));
