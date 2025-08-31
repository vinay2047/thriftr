// src/pages/CreateListing.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProductsStore } from "@/stores/useProductsStore";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const { createListing } = useProductsStore();
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Furniture",
    "Sports",
    "Toys",
    "Health",
    "Beauty",
    "Grocery",
    "Jewelry",
    "Automotive",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !description || !price) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);

    if (images) {
      Array.from(images).forEach((img) => formData.append("images", img));
    }

    try {
      await createListing(formData);
      navigate("/profile");
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-card rounded-2xl shadow-md">
      <div className="mb-6">
        <Navbar />
      </div>

      <h1 className="text-2xl font-bold mb-6">Create Product Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title" className="mb-2 block">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="mb-2 block">Category</Label>
          <Select.Root value={category} onValueChange={setCategory}>
            <Select.Trigger className="w-full border rounded-md p-2 flex justify-between items-center">
              <Select.Value placeholder="Select Category" />
              <Select.Icon>
                <ChevronDown className="w-4 h-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Content className="bg-card border rounded-md mt-1 shadow-md z-50">
              <Select.Viewport className="p-1">
                {categories.map((cat) => (
                  <Select.Item
                    key={cat}
                    value={cat}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <Select.ItemText>{cat}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Label htmlFor="description" className="mb-2 block">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="price" className="mb-2 block">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="images" className="mb-2 block">Images (max 3)</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
          />
        </div>

        <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-600">
          Create Listing
        </Button>
      </form>
    </div>
  );
}
