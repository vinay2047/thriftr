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
  likeCount: number;
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
  sort:string;
}

export interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}



export type Review = {
  _id?: string;
  productId: string;
  authorId: string | { _id: string; name: string };
  review: string;
  rating: number;
  createdAt: string;
  updatedAt:string
};
export type ReviewInput = Omit<Review, "_id" | "authorId" | "createdAt" | "updatedAt">;

export interface CartItem extends Product {
  quantity: number;
}

export type OrderProductInput = {
  productId: string;
  quantity: number;
};