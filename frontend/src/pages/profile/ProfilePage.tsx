import React, { useEffect, useState } from "react";
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
import { useProductsStore } from "@/stores/useProductsStore";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

// ---------- Types ----------
type ContactInfo = {
  phoneNo: string;
  contactEmail: string;
};

type LocationInfo = {
  city: string;
  state: string;
  country: string;
};

type Product = {
  _id: string;
  title: string;
  description?: string;
  images?: { url: string }[];
};

type OrderProduct = {
  productId?: Product;
};

type Order = {
  _id: string;
  paymentStatus: string;
  subtotal: number;
  products: OrderProduct[];
};

type Listing = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: { url: string }[];
};

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "buyer" | "seller";
  contactInfo?: ContactInfo;
  location?: LocationInfo;
  likes?: Product[];
  orders?: Order[];
};

export default function ProfilePage() {
  const { user, fetchUser, updateUser, isLoading } = useUserStore() as {
    user: User | null;
    fetchUser: () => Promise<void>;
    updateUser: (c: ContactInfo, l: LocationInfo) => Promise<void>;
    isLoading: boolean;
  };

  const { listings, fetchListings, deleteListing, updateListing } = useProductsStore() as {
    listings: Listing[];
    fetchListings: () => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  };

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phoneNo: "",
    contactEmail: "",
  });
  const [location, setLocation] = useState<LocationInfo>({
    city: "",
    state: "",
    country: "",
  });
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setContactInfo(user.contactInfo || { phoneNo: "", contactEmail: "" });
      setLocation(user.location || { city: "", state: "", country: "" });
      if (user.role === "seller") {
        fetchListings();
      }
    }
  }, [user, fetchListings]);

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(contactInfo, location);
    await fetchUser();
  };

  const handleDelete = async (id: string) => {
    await deleteListing(id);
    fetchListings();
    setDeleteConfirmId(null);
  };

  const handleUpdateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingListing?.title ||
      !editingListing?.description ||
      !editingListing?.price ||
      !editingListing?.category
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      await updateListing(editingListing._id, {
        title: editingListing.title,
        description: editingListing.description,
        price: Number(editingListing.price),
        category: editingListing.category,
      });
      fetchListings();
      setEditingListing(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing");
    }
  };

  if (isLoading)
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

      {/* Avatar & Info */}
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-sm text-gray-400">
                Member since {format(new Date(user.createdAt), "MMMM yyyy")}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit Info</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Info</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleUserUpdate}>
                <div>
                  <Label className="mb-2 block">Phone Number</Label>
                  <Input
                    value={contactInfo.phoneNo}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phoneNo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Contact Email</Label>
                  <Input
                    value={contactInfo.contactEmail}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, contactEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">City</Label>
                  <Input
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">State</Label>
                  <Input
                    value={location.state}
                    onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Country</Label>
                  <Input
                    value={location.country}
                    onChange={(e) => setLocation({ ...location, country: e.target.value })}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="likes" className="w-full">
        <div className="flex justify-center">
          <TabsList className="inline-flex space-x-4">
            <TabsTrigger className="w-40 text-center py-2" value="likes">
              Liked Products
            </TabsTrigger>
            <TabsTrigger className="w-40 text-center py-2" value="orders">
              Orders
            </TabsTrigger>
            {user?.role === "seller" && (
              <TabsTrigger className="w-40 text-center py-2" value="listings">
                My Listings
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Likes */}
        <TabsContent value="likes" className="space-y-4 mt-4">
          {user?.likes && user.likes.length > 0 ? (
            user.likes.map((product, idx) => (
              <Card
                key={`${product._id}-${idx}`}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
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
            <Card className="p-6 text-center text-gray-500">No liked products yet.</Card>
          )}
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-4 mt-4">
          <div className="flex justify-end mb-2">
            <Button onClick={() => navigate("/orders")}>View Orders</Button>
          </div>
          {user?.orders && user.orders.length > 0 ? (
            user.orders.map((order, oIdx) => (
              <Card key={`${order._id}-${oIdx}`} className="p-4">
                <p className="font-semibold">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Payment Status: {order.paymentStatus}
                </p>
                <p className="text-sm">Subtotal: ₹{order.subtotal}</p>
                <div className="mt-2 flex gap-4 overflow-x-auto">
                  {order.products.map((p, pIdx) => (
                    <div
                      key={`${order._id}-${p.productId?._id || pIdx}`}
                      className="flex flex-col items-center"
                    >
                      {p.productId?.images?.[0]?.url && (
                        <img
                          src={p.productId.images[0].url}
                          alt={p.productId.title}
                          className="h-20 w-20 object-cover rounded-xl"
                        />
                      )}
                      <p className="text-sm mt-1">{p.productId?.title}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-gray-500">No orders yet.</Card>
          )}
        </TabsContent>

        {/* Listings */}
        {user?.role === "seller" && (
          <TabsContent value="listings" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button onClick={() => navigate("/create-listing")}>
                + Create New Listing
              </Button>
            </div>
            {listings && listings.length > 0 ? (
              listings.map((listing, idx) => (
                <Card key={`${listing._id}-${idx}`} className="transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    {listing.images?.[0]?.url && (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{listing.title}</h3>
                      <p className="text-sm text-gray-500">{listing.description}</p>
                      <p className="text-sm font-semibold">₹{listing.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingListing(listing)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeleteConfirmId(listing._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-gray-500">No listings yet.</Card>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Listing Dialog */}
      {editingListing && (
        <Dialog open={true} onOpenChange={() => setEditingListing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateListing}>
              <div>
                <Label className="mb-2 block">Title</Label>
                <Input
                  value={editingListing.title}
                  onChange={(e) =>
                    setEditingListing({ ...editingListing, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">Description</Label>
                <Input
                  value={editingListing.description}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">Price</Label>
                <Input
                  type="number"
                  value={editingListing.price}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">Category</Label>
                <Input
                  value={editingListing.category}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <Dialog open={true} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this listing?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
