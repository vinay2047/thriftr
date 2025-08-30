import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import ReviewsSection from "./ReviewsSection";
import SellerDetails from "./SellerDetails";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, updateProductQuantity, deleteFromCart } =
    useCartStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = (productId: string) => {
    if (!authUser) {
      navigate("/login");
      toast.error("Please login to add to cart");
      return;
    }

    const existing = cartItems.find((item) => item._id === productId);
    if (existing) {
      updateProductQuantity(productId, existing.quantity + 1);
    } else {
      addToCart(productId);
    }
  };

  const handleDecreaseQuantity = (productId: string, quantity: number) => {
    if (quantity === 1) {
      deleteFromCart(productId);
    } else {
      updateProductQuantity(productId, quantity - 1);
    }
  };

  const handleIncreaseQuantity = (productId: string, quantity: number) => {
    updateProductQuantity(productId, quantity + 1);
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Product>(
        `/products/${productId}`
      );
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProductDetails();
  }, [productId]);

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

  const cartItem = cartItems.find((item) => item._id === product._id);

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

        {/* Average Rating */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1  text-yellow-400 font-medium">
            {product.averageRating?.toFixed(1)} <Star className="h-4 w-4" />
          </span>
          <span className="text-gray-500 text-sm">
            Rated by {product.reviewCount || 0} {product.reviewCount === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="flex items-center space-x-6 mb-2">
          <span className="text-2xl font-semibold text-purple-600">
            ₹{product.price}
          </span>
        </div>

        {/* Add to Cart / Quantity Buttons */}
        <div className="flex gap-4 mb-10">
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleDecreaseQuantity(product._id!, cartItem.quantity)
                }
              >
                -
              </Button>
              <span>{cartItem.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleIncreaseQuantity(product._id!, cartItem.quantity)
                }
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => handleAddToCart(product._id!)}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <CreditCard className="h-4 w-4" />
            Buy Now
          </Button>
        </div>

        <SellerDetails seller={product.sellerId} />

        <ReviewsSection productId={product._id!} />
      </div>
    </div>
  );
}
