import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar"; // adjust path
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Filter } from "lucide-react"; // ✅ commonly used filter icon

export default function ProductsPage() {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setFilters,
    filters,
  } = useProductsStore();

  const [search, setSearch] = useState(filters.search);
  const [category, setCategory] = useState(filters.category);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(filters.minPrice) || 0,
    Number(filters.maxPrice) || 1000,
  ]);
  const [sort, setSort] = useState("default"); // fake sorting options

  const [openFilters, setOpenFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load products initially
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchProducts(1);
      setIsLoading(false);
    };
    load();
  }, [fetchProducts]);

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
    setOpenFilters(false); // close dialog
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Search + Filter Trigger */}
      <div className="pt-20 px-6 flex justify-center">
        <div className="flex items-center w-full max-w-2xl gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={() => setOpenFilters(true)}>
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={openFilters} onOpenChange={setOpenFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filters & Sorting</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Category */}
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <Select value={category} onValueChange={(val) => setCategory(val)}>
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

            {/* Price Range */}
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

            {/* Sorting */}
            <div>
              <p className="text-sm font-medium mb-2">Sort By</p>
              <Select value={sort} onValueChange={(val) => setSort(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Products Grid */}
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
          products.map((product) => (
            <Card key={product._id} className="hover:shadow-md">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {product.images?.[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <p className="text-gray-700">${product.price}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>

      {/* Pagination */}
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
