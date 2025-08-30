import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProductsStore } from "../../stores/useProductsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Filter } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export default function ProductsPage() {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setFilters,
    filters,
  } = useProductsStore();

  const { authUser } = useAuthStore();
  const {
    cartItems,
    addToCart,
    updateProductQuantity,
    deleteFromCart,
    fetchCartItems,
  } = useCartStore();

  const [search, setSearch] = useState(filters.search);
  const [category, setCategory] = useState(filters.category);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(filters.minPrice) || 0,
    Number(filters.maxPrice) || 1000,
  ]);
  const [sort, setSort] = useState("default");
  const [openFilters, setOpenFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchProducts(1);
      await fetchCartItems();
      setIsLoading(false);
    };
    load();
  }, [fetchProducts, fetchCartItems]);

  const handleApplyFilters = async () => {
    setFilters({
      search,
      category: category === "all" ? "" : category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
    setIsLoading(true);
    await fetchProducts(1);
    setIsLoading(false);
    setOpenFilters(false);
  };

  const handleAddToCart = async (productId: string) => {
    if (!authUser) {
      navigate("/login");
      toast.error("Please login to add to cart");
      return;
    }

    // optimistic UI
    const existing = cartItems.find((item) => item._id === productId);
    if (existing) {
      updateProductQuantity(productId, existing.quantity + 1);
    } else {
      addToCart(productId);
    }
  };

  const handleDecreaseQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity === 1) {
      deleteFromCart(productId);
    } else {
      updateProductQuantity(productId, quantity - 1);
    }
  };

  const handleIncreaseQuantity = async (
    productId: string,
    quantity: number
  ) => {
    updateProductQuantity(productId, quantity + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-20 px-6 flex justify-center">
        <div className="flex items-center w-full max-w-2xl gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenFilters(true)}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={openFilters} onOpenChange={setOpenFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filters & Sorting</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Toys">Toys</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Grocery">Grocery</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </p>
              <Slider
                value={priceRange}
                onValueChange={(val) => setPriceRange(val as [number, number])}
                min={0}
                max={1000}
                step={10}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Sort By</p>
              <Select value={sort} onValueChange={(val) => setSort(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))
        ) : products.length > 0 ? (
          products.map((product) => {
            const cartItem = cartItems.find((item) => item._id === product._id);

            return (
              <Card
                key={product._id}
                className="hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-gray-700">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex-1" /> {/* pushes button to bottom */}
                  {cartItem ? (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecreaseQuantity(
                            product._id,
                            cartItem.quantity
                          );
                        }}
                        disabled={isLoading}
                      >
                        -
                      </Button>
                      <span>{cartItem.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncreaseQuantity(
                            product._id,
                            cartItem.quantity
                          );
                        }}
                        disabled={isLoading}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        className="mt-3 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                        disabled={isLoading}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>

      <div className="w-full flex justify-center py-6">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={async () => {
                    setIsLoading(true);
                    await fetchProducts(i + 1);
                    setIsLoading(false);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
