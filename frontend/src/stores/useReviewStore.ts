import { axiosInstance } from "@/lib/axios";
import type { Review } from "@/types";
import { toast } from "sonner";
import {create} from "zustand";

interface ReviewStore {
    reviews: Review[];
    isLoading: boolean;
    fetchReviews: (productId: string) => void
    createReview:(review:Review)=>void
    deleteReview:(reviewId:string)=>void
}
export const useReviewStore = create<ReviewStore>((set) => ({
    reviews: [],
    isLoading: false,
    fetchReviews: async (productId: string) => {
        try {
            set({ isLoading: true });
            const response = await axiosInstance.get(`/reviews/${productId}`);
            set({ reviews: response.data });
        } catch(error){
             console.log('Error fetching reviews',error)
             toast.error("Failed to fetch reviews")
        }finally {
            set({ isLoading: false });
        }   
    },
    createReview:async(review:Review)=>{
        try {
            set({isLoading:true})
            const response=await axiosInstance.post("/reviews",review)
            if(response.data.success){
                set({reviews:[...response.data.review]})
            }
        } catch (error) {
            console.log('Error creating review',error)
            toast.error("Failed to create review")

        }finally{
            set({isLoading:false})
        }
    },
    deleteReview:async(reviewId:string)=>{
        try {
            set({isLoading:true})
            const response=await axiosInstance.delete(`/reviews/${reviewId}`)
            if(response.data.success){
                set((state:any)=>({reviews:state.reviews.filter((review:Review)=>review._id!==reviewId)}))
            }
        } catch (error) {
            console.log('Error deleting review',error)
            toast.error("Failed to delete review")
        }finally{
            set({isLoading:false})
        }
    }
    
}))