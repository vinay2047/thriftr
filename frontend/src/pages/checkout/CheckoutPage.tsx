import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CheckoutPage() {
 
  const { user, fetchUser, updateUser } = useUserStore();
  const { createOrder } = useOrdersStore();
  const { cartItems, fetchCartItems } = useCartStore();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [contactInfo, setContactInfo] = useState({ phoneNo: "", contactEmail: "" });
  const [location, setLocation] = useState({ city: "", state: "", country: "" });
  const [paymentMode, setPaymentMode] = useState<"cod" | "paynow" | "">("");
  const [subtotal, setSubtotal] = useState(0);

  const platformFee = 20;
  const total = subtotal + platformFee;

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchCartItems();
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      const missingFields =
        !user.contactInfo?.phoneNo ||
        !user.contactInfo?.contactEmail ||
        !user.location?.city ||
        !user.location?.state ||
        !user.location?.country;

      if (missingFields) {
        setContactInfo({
          phoneNo: user.contactInfo?.phoneNo || "",
          contactEmail: user.contactInfo?.contactEmail || "",
        });
        setLocation({
          city: user.location?.city || "",
          state: user.location?.state || "",
          country: user.location?.country || "",
        });
        setOpenDialog(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const cartSubtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(cartSubtotal);
    }
  }, [cartItems]);

  const handleSaveUserDetails = async () => {
    if (
      !contactInfo.phoneNo ||
      !contactInfo.contactEmail ||
      !location.city ||
      !location.state ||
      !location.country
    ) {
      toast.error("All fields are required");
      return;
    }
    await updateUser(contactInfo, location);
    setOpenDialog(false);
    toast.success("Profile updated successfully");
  };

  const handlePlaceOrder = async () => {
    if (!paymentMode) {
      toast.error("Select a payment mode");
      return;
    }

    const paymentStatus = paymentMode === "paynow" ? "completed" : "pending";

    const products = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    const sellerIds = Array.from(
      new Set(
        cartItems
          .map((item) =>
            typeof item.sellerId === "object" ? item.sellerId._id : item.sellerId
          )
          .filter(Boolean)
      )
    );

    if (sellerIds.length === 0) {
      toast.error("No valid seller IDs found");
      return;
    }

    const order = await createOrder(sellerIds, products, subtotal, paymentStatus);

    if (order) {
      toast.success("Order placed successfully");
      navigate("/orders");
    } else {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-start pt-20 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div>
            <p className="text-sm mb-2">Payment Mode</p>
            <Select
              value={paymentMode}
              onValueChange={(v: "cod" | "paynow") => setPaymentMode(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paynow">Pay Now</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Phone Number"
              value={contactInfo.phoneNo}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phoneNo: e.target.value })
              }
            />
            <Input
              placeholder="Contact Email"
              value={contactInfo.contactEmail}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, contactEmail: e.target.value })
              }
            />
            <Input
              placeholder="City"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
            />
            <Input
              placeholder="State"
              value={location.state}
              onChange={(e) =>
                setLocation({ ...location, state: e.target.value })
              }
            />
            <Input
              placeholder="Country"
              value={location.country}
              onChange={(e) =>
                setLocation({ ...location, country: e.target.value })
              }
            />
            <Button className="w-full" onClick={handleSaveUserDetails}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
