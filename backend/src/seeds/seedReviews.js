import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js"; // Adjust path
import { Product } from "../models/product.model.js"; // Adjust path
import { Review } from "../models/review.model.js"; // Adjust path

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Utility function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Array of sample review texts
const sampleReviews = [
    "Great product!",
    "Really satisfied with this purchase.",
    "Could be better.",
    "Not what I expected.",
    "Excellent quality and fast delivery.",
    "",
    "",
];

const seedReviews = async () => {
    try {
        
        const products = await Product.find({});
        const buyers = await User.find({ role: "buyer" });

        if (!products.length || !buyers.length) {
            console.log("No products or buyers found. Exiting.");
            return;
        }

        const reviewsToInsert = [];

        for (const product of products) {
            // Number of reviews per product: 2 or 3
            const numReviews = getRandomInt(2, 3);

            for (let i = 0; i < numReviews; i++) {
                const randomBuyer = buyers[getRandomInt(0, buyers.length - 1)];
                const randomRating = getRandomInt(1, 5);
                const randomReview = sampleReviews[getRandomInt(0, sampleReviews.length - 1)];

                reviewsToInsert.push({
                    authorId: randomBuyer._id,
                    productId: product._id,
                    rating: randomRating,
                    review: randomReview,
                });
            }
        }

        await Review.insertMany(reviewsToInsert);
        console.log(`Inserted ${reviewsToInsert.length} reviews successfully.`);
    } catch (err) {
        console.error("Error seeding reviews:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedReviews();
