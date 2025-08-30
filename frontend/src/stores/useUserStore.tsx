import { create } from "zustand";

import { axiosInstance } from "@/lib/axios";

interface ContactInfo {
  phoneNo: string;
  contactEmail: string;
}

interface Location {
  city: string;
  state: string;
  country: string;
}

interface Product {
  _id: string;
  title: string;
  images: { url: string }[];
  rating: number;
}

interface Order {
  _id: string;
  products: Product[];
  subtotal: number;
  paymentStatus: "pending" | "paid" | "failed";
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  likes: Product[];
  orders: Order[];
  contactInfo: ContactInfo;
  location: Location;
  createdAt: string;
}

interface UserStore {
  user: User | null;
  fetchUser: () => Promise<void>;
  updateUser: (contactInfo: ContactInfo, location: Location) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      console.log(res.data);
      set({ user: res.data });
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  },

  updateUser: async (contactInfo, location) => {
    try {
      const res = await axiosInstance.patch(
        "/users/update",
        { contactInfo, location }
      );
      set({ user: res.data });
    } catch (err) {
      console.error("Failed to update user", err);
    }
  },
}));
