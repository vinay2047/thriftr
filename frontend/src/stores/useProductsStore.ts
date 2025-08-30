import { axiosInstance } from "@/lib/axios";
import type { ProductFilters, ProductsResponse, Product } from "@/types";
import { create } from "zustand";

export interface ProductsStore {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  filters: ProductFilters;
  isLoading: boolean;
  likedProducts: string[]; // store liked product IDs
  setProducts: (data: ProductsResponse) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  fetchProducts: (page?: number) => Promise<void>;
  fetchUserLikes: () => Promise<void>;
  toggleLike: (productId: string) => Promise<void>;
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
    limit: 10,
  },

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
      }).toString();

      const res = await axiosInstance.get<ProductsResponse>(
        `/products?${query}`
      );
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
}));
