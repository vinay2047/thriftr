import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import type { Product, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Trash, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useReviewStore } from "@/stores/useReviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import StarRating from "./StarRating";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const { reviews, fetchReviews, createReview, deleteReview, isLoading } =
    useReviewStore();
  const { authUser } = useAuthStore();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Product>(`/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchReviews(productId);
    }
  }, [productId]);

  const handleReviewSubmit = async () => {
    if (!authUser || !productId) return;

    const newReview: Review = {
      productId,
      authorId: authUser._id,
      review: reviewText,
      rating,
    };

    createReview(newReview);
    setReviewText("");
    setRating(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Product not found.</p>
      </div>
    );
  }

  const seller = typeof product.sellerId === "object" ? product.sellerId : null;

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-10">
        {/* Product Images Carousel */}
        <div className="mb-6">
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              {product.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <img
                    src={img.url}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-xl shadow-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Product Info */}
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="flex items-center space-x-6 mb-2">
          <span className="text-2xl font-semibold text-purple-600">
            ₹{product.price}
          </span>
        </div>

        <div className="flex gap-4 mb-10">
          <Button className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <CreditCard className="h-4 w-4" />
            Buy Now
          </Button>
        </div>

        {/* Seller Info (moved below buttons) */}
        {seller && (
          <div className="p-4 border rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-2">Seller Details</h2>
            <p className="text-gray-700">{(seller as any).name}</p>
            {(seller as any).contactInfo && (
              <div className="text-sm text-gray-600 mt-1">
                <p>Email: {(seller as any).contactInfo.email}</p>
                <p>Phone: {(seller as any).contactInfo.phone}</p>
                <p>Location: {(seller as any).contactInfo.location}</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="p-4 border rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          {/* ✅ StarRating component for own review */}
          <StarRating rating={rating} onRatingChange={setRating} />

          <textarea
            className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            rows={3}
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button
            className="mt-3 bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleReviewSubmit}
            disabled={!authUser || isLoading}
          >
            Submit Review
          </Button>

          {/* Display Other Reviews */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: Review) => (
                  <div
                    key={review._id}
                    className="p-3 border rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        {/* ✅ Yellow static stars for other reviews */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mt-1">{review.review}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          By{" "}
                          <span className="font-medium">
                            {(review.authorId as any)?.name || "Unknown"}
                          </span>{" "}
                          · {format(new Date(review.createdAt), "PPP")}
                        </p>
                      </div>
                      {authUser && review.authorId === authUser._id && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteReview(review._id!)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
