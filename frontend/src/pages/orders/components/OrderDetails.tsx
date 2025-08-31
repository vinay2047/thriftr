// src/pages/OrderDetailsPage.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { selectedOrder, fetchOrderById, loading, error } = useOrdersStore();
  const { authUser } = useAuthStore();
  const n = 5;

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading order...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!selectedOrder) return <div className="text-center mt-10 text-gray-500">No order found.</div>;

  const { products, subtotal, paymentStatus } = selectedOrder;

  // Filter products if user is a seller
  const visibleProducts = authUser.role === "buyer"
    ? products
    : products.filter(item => item.productId.sellerId?._id === authUser._id);

  // Total cost for seller
  const sellerTotal = visibleProducts.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const platformFee = Math.floor(subtotal * 0.017 + n);
  const total = authUser.role === "buyer" ? subtotal + platformFee : sellerTotal;

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "success";
      case "pending": return "warning";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold text-primary">Order Details</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order ID: {selectedOrder._id}</span>
              <Badge variant={getBadgeVariant(paymentStatus)}>{paymentStatus}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleProducts.map((item, idx) => {
              const seller = item.productId.sellerId;

              return (
                <Card key={idx} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <img
                      src={item.productId.images?.[0]?.url}
                      alt={item.productId.title}
                      className="h-40 w-40 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 flex flex-col justify-center space-y-2">
                        <h2 className="font-semibold text-xl">{item.productId.title}</h2>
                        <p className="text-base text-gray-400">SKU: {item.productId.SKU}</p>
                        <p className="text-base text-gray-400">Quantity: {item.quantity}</p>
                        <p className="font-medium text-lg text-primary">
                          Subtotal: ₹{item.productId.price * item.quantity}
                        </p>
                      </div>

                      {authUser.role === "buyer" && (
                        <div className="flex-1 border-l border-gray-500 pl-4 space-y-1">
                          <h3 className="font-medium text-gray-600">Seller Details:</h3>
                          <p><span className="font-medium">Name: </span>{seller?.name}</p>
                          <p><span className="font-medium">Email: </span>{seller?.contactInfo?.contactEmail || seller?.email}</p>
                          <p><span className="font-medium">Phone: </span>{seller?.contactInfo?.phoneNo || "N/A"}</p>
                          <p><span className="font-medium">Location: </span>
                            {seller?.location?.city}, {seller?.location?.state}, {seller?.location?.country}
                          </p>
                          <Button variant="default" className="flex items-center gap-2 mt-2">
                            <MessageCircle className="w-4 h-4" />
                            Chat with Seller
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            <div className="flex justify-between text-lg font-semibold border-t pt-4">
              <span>{authUser.role === "buyer" ? "Subtotal" : "Total"}</span>
              <span className="text-primary">₹{total}</span>
            </div>

            {authUser.role === "buyer" && (
              <>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Platform Fee</span>
                  <span className="text-primary">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
