import { useEffect, useMemo } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const {
    cartItems,
    fetchCartItems,
    updateProductQuantity,
    deleteFromCart,
    isLoading,
  } = useCartStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  // default n value for fee calculation
  const n = 5;

  useEffect(() => {
    if (authUser) {
      fetchCartItems();
    }
  }, [authUser, fetchCartItems]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const platformFee = useMemo(
    () => Math.floor(0.017 * subtotal + n),
    [subtotal, n]
  );

  if (!authUser) {
    return (
      <>
        <div className="mb-10">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-gray-600">
            Please log in to view your cart.
          </p>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="mb-10">
          <Navbar />
        </div>
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </>
    );
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <>
        <div className="mb-10">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-gray-600">
            Your cart is empty 🛒
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-10">
        <Navbar />
      </div>
      <div className="max-w-4xl mx-auto py-10 px-4 mb-20">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <Card key={item._id} className="shadow-sm rounded-2xl">
              <CardContent className="flex items-center gap-6 p-4">
                {item.images[0] && (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      item.quantity === 1
                        ? deleteFromCart(item._id)
                        : updateProductQuantity(item._id, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-3 font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateProductQuantity(item._id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteFromCart(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{subtotal + platformFee}</span>
          </div>
          <Button
            variant="default"
            className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
