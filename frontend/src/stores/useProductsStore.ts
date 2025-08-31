import { axiosInstance } from "@/lib/axios";
import type { ProductFilters, ProductsResponse, Product } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

export interface ProductsStore {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  filters: ProductFilters;
  isLoading: boolean;
  likedProducts: string[];
  listings: Product[];
  setProducts: (data: ProductsResponse) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  fetchProducts: (page?: number) => Promise<void>;
  fetchUserLikes: () => Promise<void>;
  toggleLike: (productId: string) => Promise<void>;
  createListing: (formData: FormData) => Promise<Product | undefined>;
  fetchListings: () => void;
  updateListing: (productId: string, formData: FormData) => Promise<void>;
  deleteListing: (productId: string) => Promise<void>;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  isLoading: false,
  likedProducts: [],
  filters: {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "default",  
  limit: 10,
},
  listings: [],

  setProducts: (data: ProductsResponse) =>
    set({
      products: data.products,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalProducts: data.totalProducts,
    }),

  setFilters: (filters: Partial<ProductFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  fetchProducts: async (page: number = 1) => {
  const { filters } = get();
  try {
    set({ isLoading: true });
    const query = new URLSearchParams({
      page: String(page),
      limit: String(filters.limit),
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.minPrice ? { minPrice: String(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { maxPrice: String(filters.maxPrice) } : {}),
      ...(filters.sort && filters.sort !== "default"
        ? { sort: filters.sort }
        : {}),
    }).toString();

    const res = await axiosInstance.get<ProductsResponse>(`/products?${query}`);
    get().setProducts(res.data);
  } finally {
    set({ isLoading: false });
  }
},

  fetchUserLikes: async () => {
    try {
      const res = await axiosInstance.get<string[]>("/users/likes");
      set({ likedProducts: res.data });
    } catch (err) {
      console.error("Failed to fetch user likes:", err);
    }
  },

  toggleLike: async (productId: string) => {
    try {
      const res = await axiosInstance.post(`/products/like/${productId}`);
      set((state) => {
        const isLiked = state.likedProducts.includes(productId);
        return {
          likedProducts: isLiked
            ? state.likedProducts.filter((id) => id !== productId)
            : [...state.likedProducts, productId],
          products: state.products.map((p) =>
            p._id === productId ? res.data.product : p
          ),
        };
      });
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  },

  createListing: async (formData: FormData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created successfully");
      set((state) => ({ listings: [...state.listings, res.data] }));
      return res.data;
    } catch (err: any) {
      console.error("Failed to create product:", err);
      const message = err.response?.data?.message || "Failed to create product";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchListings: async () => {
    try {
      const res = await axiosInstance.get("/users/listings");
      set({ listings: res.data });
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  },

  updateListing: async (productId, formData) => {
  try {
    const res = await axiosInstance.put(`/products/update/${productId}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success("Product updated successfully");
    set((state) => ({
      listings: state.listings.map((p) =>
        p._id === productId ? res.data.product : p
      ),
    }));
  } catch (err: any) {
    console.error("Failed to update product:", err);
    toast.error(err.response?.data?.message || "Failed to update product");
  }
},


  deleteListing: async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      set((state) => ({
        listings: state.listings.filter((p) => p._id !== productId),
      }));
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  },
}));
