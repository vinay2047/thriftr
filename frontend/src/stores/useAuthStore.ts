import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types";
import {create} from "zustand";
import { toast } from "sonner"

interface AuthStore{
    authUser:User|null,
    isLoading:boolean,
    signup:(user:User)=>void,
    login:(user:User)=>void,
    logout:()=>void
}
export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isLoading: false,
    signup: async(user:User) => {
       set({isLoading:true})
       try {
        const response=await axiosInstance.post("/auth/signup",{
            name:user.name,
            email:user.email,
            password:user.password
            

        })
        if(response.data.success){
            set({authUser:response.data.user})
            toast.success("Account created successfully")
        }
       } catch (error) {
        toast.error("Signup failed")
         set({authUser:null})
         console.log('Error signing up',error)
       }finally{
        set({isLoading:false})
       }
    },
    login:async(user:User)=>{
      try {
        set({isLoading:true})
        const response=await axiosInstance.post("/auth/login",{
            email:user.email,
            password:user.password
        })
        if(response.data.success){
            set({authUser:response.data.user})
            toast.success("Login successful")
        }
      } catch (error) {
        toast.error("Login failed")
        set({authUser:null})
        console.log('Error logging in',error)
      }finally{
        set({isLoading:false})
      }
      
    },
    logout:async()=>{
      try {
        const response=await axiosInstance.get("/auth/logout")
        if(response.data.success){
            set({authUser:null})
        }
      } catch (error) {
        console.log('Error logging out',error)
      }
      
    }
})) 