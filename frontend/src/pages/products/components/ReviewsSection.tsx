import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Star } from "lucide-react";
import { useReviewStore } from "@/stores/useReviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { format } from "date-fns";
import StarRating from "./StarRating";
import type { Review } from "@/types";

type Props = {
  productId: string;
};

export default function ReviewsSection({ productId }: Props) {
  const { reviews, fetchReviews, createReview, deleteReview, isLoading } =
    useReviewStore();
  const { authUser } = useAuthStore();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (productId) fetchReviews(productId);
  }, [productId]);

  const handleReviewSubmit = () => {
    if (!authUser || !productId) return;
    const newReview: Review = { productId, review: reviewText, rating };
    createReview(newReview);
    setReviewText("");
    setRating(0);
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
      <StarRating rating={rating} onChange={setRating} />

      <textarea
        className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <Button
        className="mt-3 bg-primary text-white hover:bg-primary/90"
        onClick={handleReviewSubmit}
        disabled={!authUser || isLoading}
      >
        Submit Review
      </Button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-3 border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
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
                  {authUser &&
                    (typeof review.authorId !== "string" &&
                      review.authorId._id === authUser._id) && (
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
  );
}
