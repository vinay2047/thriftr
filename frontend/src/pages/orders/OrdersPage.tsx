import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrdersStore } from "@/stores/useOrdersStore";
import Navbar from "@/components/Navbar";

const OrdersPage = () => {
  const { authUser } = useAuthStore();
  const { orders, fetchOrders, loading } = useOrdersStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const isBuyer = authUser?.role === "buyer";

  return (
    <div>
      
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {!authUser ? (
          <div className="p-6 text-center text-white">
            Please login to view orders.
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-10 text-white">
              {isBuyer ? "Your Orders" : "Received Orders"}
            </h1>

            {loading ? (
              <div className="text-center text-gray-500">Loading orders...</div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center text-gray-500">No orders found.</div>
            ) : (
              <ScrollArea className="max-h-[calc(100vh-250px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order) => {
                    const firstProduct = order.products[0]?.productId;

                    return (
                      <Card
                        key={order._id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            <span>Order ID: {order._id.slice(-6)}</span>
                            <Badge
                              variant={
                                order.paymentStatus === "completed"
                                  ? "success"
                                  : order.paymentStatus === "failed"
                                  ? "destructive"
                                  : "warning"
                              }
                            >
                              {order.paymentStatus}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {firstProduct && firstProduct.images?.[0]?.url && (
                            <img
                              src={firstProduct.images[0].url}
                              alt={firstProduct.title}
                              className="w-full h-48 object-cover rounded mb-4"
                            />
                          )}
                          <div className="mb-2">
                            <strong>Items:</strong> {order.products.length}
                          </div>
                          <div className="mb-4">
                            <strong>Subtotal:</strong> ₹{order.subtotal.toFixed(2)}
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
