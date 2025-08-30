import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types";
import { create } from "zustand";
import { toast } from "sonner";

interface AuthStore {
  authUser: User | null;
  isLoading: boolean;
  signup: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoading: false,
  signup: async (user: User) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      if (response.data.success) {
        set({ authUser: response.data.user });
        toast.success("Account created successfully");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      toast.error(message);
      set({ authUser: null });
      console.log("Error signing up", error);
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (user: User) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/auth/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.success) {
        set({ authUser: response.data.user });
        toast.success(`Welcome back ${response.data.user.name}!`);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(message);
      set({ authUser: null });
      console.log("Error logging in", error);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      if (response.data.success) {
        toast.success("Logged out successfully");
        set({ authUser: null });
      }
    } catch (error) {
      console.log("Error logging out", error);
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check", {
        withCredentials: true, 
      });
      if (response.data.user) {
        set({ authUser: response.data.user });
      }else {
      set({ authUser: null });
    }
    } catch (error: any) {
      set({ authUser: null });
      console.log("Not authorized", error);
    }
  }
}));
