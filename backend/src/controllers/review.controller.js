import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";


export const createProductReview=async(req,res)=>{
    const {rating,review,productId}=req.body;
    const userId=req.user._id;
    const product=await Product.findById(productId);
    const user=req.user._id
    const reviewExists=product.reviews.find((review)=>review.authorId==user);
    if(reviewExists){
        return res.status(400).json({message:"You have already reviewed this product"});
    }
    const newReview=new Review({authorId:user,productId,rating,review});
    product.reviews.push(newReview);
    product.averageRating=(product.averageRating*product.reviews.length+rating)/(product.reviews.length+1);
    await product.save();
    await newReview.save();
    res.status(201).json({message:"Review created successfully",newReview});
}

export const deleteProductReview=async(req,res)=>{
    const {reviewId}=req.params;
    const review=await Review.findById(reviewId);
    const productId=review.productId;
    const product=await Product.findById(productId);
    const reviewIndex=product.reviews.findIndex((review)=>review._id==reviewId);
    if(reviewIndex==-1){
        return res.status(404).json({message:"Review not found"});
    }
    product.reviews.splice(reviewIndex,1);
    product.averageRating=(product.averageRating*product.reviews.length-product.reviews[reviewIndex].rating)/(product.reviews.length-1);
    await Review.findByIdAndDelete(reviewId);
    await product.save();
    res.status(200).json({message:"Review deleted successfully"});
}

