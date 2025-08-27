import mongoose from "mongoose";


const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

const productSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum:["Electronics","Clothing","Books","Home","Furniture","Sports","Toys","Health","Beauty","Grocery","Jewelry","Automotive","Other"]
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [ImageSchema],
        required: true,
    },

    averageRating: {
        type: Number,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

},{timestamps:true});




export const Product=mongoose.model('Product', productSchema);