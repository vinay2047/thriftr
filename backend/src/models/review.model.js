import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        default: "",
    }
},{timestamps:true})

export const Review = mongoose.model("Review", reviewSchema);