import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/useUserStore";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, fetchUser, updateUser } = useUserStore();
  const [contactInfo, setContactInfo] = useState({
    phoneNo: "",
    contactEmail: "",
  });
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setContactInfo(user.contactInfo || { phoneNo: "", contactEmail: "" });
      setLocation(user.location || { city: "", state: "", country: "" });
    }
  }, [user]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-6">
        <Card className="animate-pulse">
          <CardHeader className="flex flex-col items-center space-y-2">
            <div className="h-24 w-24 rounded-full bg-gray-300"></div>
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-28 bg-gray-300 rounded"></div>
          </CardHeader>
        </Card>
        <div className="space-y-4">
          <Card className="h-40 animate-pulse bg-gray-200"></Card>
          <Card className="h-40 animate-pulse bg-gray-200"></Card>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="mb-20">
        <Navbar />
      </div>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400">
              Member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {/* Edit Profile Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit Info</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Info</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(contactInfo, location);
                }}
              >
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contactInfo.phoneNo || ""}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        phoneNo: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    value={contactInfo.contactEmail || ""}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        contactEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={location.city || ""}
                    onChange={(e) =>
                      setLocation({ ...location, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={location.state || ""}
                    onChange={(e) =>
                      setLocation({ ...location, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={location.country || ""}
                    onChange={(e) =>
                      setLocation({ ...location, country: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>

          
        </CardContent>
      </Card>

      {/* Tabs for Likes & Orders */}
      <Tabs defaultValue="likes" className="w-full">
        <div className="flex justify-center">
          <TabsList className="inline-flex space-x-4">
            <TabsTrigger className="w-40 text-center py-2" value="likes">
              Liked Products
            </TabsTrigger>
            <TabsTrigger className="w-40 text-center py-2" value="orders">
              Orders
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="likes" className="space-y-4 mt-4">
          {user.likes.length > 0 ? (
            user.likes.map((product) => (
              <Card
                key={product._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)} // ⬅️ navigate on click
              >
                <CardContent className="flex items-center gap-4">
                  {product.images?.[0]?.url && (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{product.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-gray-500">
              No liked products yet.
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-4">
          {user.orders.length > 0 ? (
            user.orders.map((order) => (
              <Card key={order._id} className="p-4">
                <p className="font-semibold">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Payment Status: {order.paymentStatus}
                </p>
                <p className="text-sm">Subtotal: ₹{order.subtotal}</p>
                <div className="mt-2 flex gap-4 overflow-x-auto">
                  {order.products.map((p) => (
                    <div key={p._id} className="flex flex-col items-center">
                      <img
                        src={p.productId?.images?.[0]?.url}
                        alt={p.productId?.title}
                        className="h-20 w-20 object-cover rounded-xl"
                      />
                      <p className="text-sm mt-1">{p.productId?.title}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-gray-500">
              No orders yet.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
