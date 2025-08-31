import { axiosInstance } from "@/lib/axios";
import type { Review, ReviewInput } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  fetchReviews: (productId: string) => void;
  createReview: (review: ReviewInput) => void;
  deleteReview: (reviewId: string) => void;
}
export const useReviewStore = create<ReviewStore>((set,get) => ({
  reviews: [],
  isLoading: false,
  fetchReviews: async (productId: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/reviews/${productId}`);
      set({ reviews: response.data });
    } catch (error:any) {
      console.log("Error fetching reviews", error);
       const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reviews";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
  createReview: async (review: ReviewInput) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/reviews", review);
      if (response.data.success) {
         set({ reviews: [...get().reviews, response.data.review] })
        toast.success("Review posted successfully")
      }
    } catch (error: any) {
      console.log("Error creating review", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create review";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteReview: async (reviewId: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.delete(`/reviews/${reviewId}`);
      if (response.data.success) {
        set((state: any) => ({
          reviews: state.reviews.filter(
            (review: Review) => review._id !== reviewId
          ),
        }));
      }
    } catch (error: any) {
      console.log("Error deleting review", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete review";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
