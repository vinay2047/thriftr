// src/pages/OrderDetailsPage.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "@/components/Navbar";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { selectedOrder, fetchOrderById, loading, error } = useOrdersStore();
  const { authUser } = useAuthStore();

  const n = 5; // dynamic seed-based number (will replace later)

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading order...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!selectedOrder) {
    return (
      <div className="text-center mt-10 text-gray-500">No order found.</div>
    );
  }

  const { products, subtotal, buyerId, sellerId, paymentStatus } =
    selectedOrder;

  const platformFee = Math.floor(subtotal * 0.017 + n); // 1.7%
  const total = subtotal + platformFee;

  const isBuyer = authUser?.role === "buyer";
  const otherParty = isBuyer ? sellerId : buyerId;

  // Badge variant based on paymentStatus
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar with margin bottom */}
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold text-purple-400">Order Details</h1>

        {/* Order summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order ID: {selectedOrder._id}</span>
              <Badge variant={getBadgeVariant(paymentStatus)}>
                {paymentStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Products */}
            <div className="space-y-4">
              {products.map((item, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    {/* Product image */}
                    <img
                      src={item.productId.images?.[0]?.url}
                      alt={item.productId.title}
                      className="h-40 w-40 rounded-xl object-cover shrink-0"
                    />

                    {/* Product details */}
                    <div className="flex flex-col justify-center space-y-2 flex-1">
                      <h2 className="font-semibold text-xl">
                        {item.productId.title}
                      </h2>
                      <p className="text-base text-gray-400">
                        SKU: {item.productId.SKU}
                      </p>
                      <p className="text-base text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium text-lg text-purple-400">
                        Subtotal: ₹{item.productId.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Order totals */}
            <div className="flex justify-between text-lg font-semibold border-t pt-4">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Platform Fee </span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-purple-400">₹{total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Other party details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isBuyer ? "Seller Details" : "Buyer Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Name: </span>
              {otherParty?.name}
            </p>
            <p>
              <span className="font-medium">Email: </span>
              {otherParty?.contactInfo?.contactEmail || otherParty?.email}
            </p>
            <p>
              <span className="font-medium">Phone: </span>
              {otherParty?.contactInfo?.phoneNo || "N/A"}
            </p>
            <p>
              <span className="font-medium">Location: </span>
              {otherParty?.location?.city}, {otherParty?.location?.state},{" "}
              {otherParty?.location?.country}
            </p>

            <Button variant="default" className="flex items-center gap-2 mt-4">
              <MessageCircle className="w-4 h-4" />
              {isBuyer ? "Chat with Seller" : "Chat with Buyer"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
