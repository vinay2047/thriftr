import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore } from "@/stores/useOrderPage";
import Navbar from "@/components/Navbar";

const OrdersPage = () => {
  const { authUser } = useAuthStore();
  const { orders, fetchOrders, loading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!authUser) return <div className="p-6 text-center">Please login to view orders.</div>;

  const isBuyer = authUser.role === "buyer";
  const pageTitle = isBuyer ? "Your Orders" : "Received Orders";

  return (
    <div>
      {/* Navbar with bottom margin */}
      <div className="mb-16">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">{pageTitle}</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <Card key={order._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Order ID: {order._id.slice(-6)}</span>
                      <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>
                        {order.paymentStatus}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <strong>Buyer:</strong> {order.buyerId.name}
                    </div>
                    <div className="mb-2">
                      <strong>Seller:</strong> {order.sellerId.name}
                    </div>
                    <div className="mb-2">
                      <strong>Items:</strong> {order.products.length}
                    </div>
                    <div className="mb-4">
                      <strong>Subtotal:</strong> ₹{order.subtotal.toFixed(2)}
                    </div>
                    <Button
                      variant="purple"
                      size="sm"
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
