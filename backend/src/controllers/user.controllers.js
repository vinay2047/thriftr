 import { User } from "../models/user.model.js";
 export const updateUser = async (req, res) => {
    const {contactInfo,location}=req.body;
    const userId = req.user._id;
    if(!contactInfo || !location || !contactInfo.phoneNo   || !location.city || !location.state || !location.country ){
        return res.status(400).json({ message: "All fields are required" });
    }
    const user=await User.findById(userId);
    if(!userId){
        return res.status(404).json({ message: "User not found" });
    }
    const updatedUser=await User.findByIdAndUpdate(contactInfo,location,{new:true});
    res.status(200).json(updatedUser);
    
}

export const getUserOrders=async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    const orders=user.orders;
    res.status(200).json(orders);
}