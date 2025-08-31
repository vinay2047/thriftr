import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { OrderProductInput } from "@/types";

interface ProductItem {
  productId: {
    title: string;
    price: number;
    images: { url: string; filename: string }[];
    SKU: string;
    sellerId: {
      name: string;
      email?: string;
      contactInfo?: {
        contactEmail?: string;
        phoneNo?: string;
      };
      location?: {
        city?: string;
        state?: string;
        country?: string;
      };
    };
  };
  quantity: number;
}

interface Order {
  _id: string;
  buyerId: {
    name: string;
    email?: string;
    contactInfo?: {
      contactEmail?: string;
      phoneNo?: string;
    };
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  sellerIds: string[]; // kept for reference
  products: OrderProductInput[];
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
  createOrder: (
    sellerIds: string[],
    products: ProductItem[],
    subtotal: number,
    paymentStatus: string
  ) => Promise<Order | null>;
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
      set({
        error: err.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
    }
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`/orders/${orderId}`);
      set({ selectedOrder: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch order",
        loading: false,
      });
    }
  },

  createOrder: async (
    sellerIds: string[],
    products: ProductItem[],
    subtotal: number,
    paymentStatus: string
  ) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/orders/checkout", {
        sellerIds,
        products,
        subtotal,
        paymentStatus,
      });
      const { order } = res.data;
      if (order) {
        set((state) => ({
          orders: [...state.orders, order],
          loading: false,
        }));
      } else {
        set({ loading: false });
      }
      return order;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create order",
        loading: false,
      });
      return null;
    }
  },
}));
