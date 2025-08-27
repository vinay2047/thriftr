export interface User{
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    contactInfo: {
        phoneNo: string;
        contactEmail: string;
    };
    location: {
        city: string;
        state: string;
        country: string;
    };
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: { url: string; filename: string }[];
  averageRating: number;
  reviewCount: number;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: string | number;
  maxPrice: string | number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}



