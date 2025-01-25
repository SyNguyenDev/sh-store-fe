export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  aboutItem: string[];
  price: number;
  discount: number;
  rating: number;
  stockItems: number;
  brand: string;
  color: string[];
  images: string[];
  reviews: Review[];
}

export interface Review {
  content: string;
  rating: number;
  author: string;
  image: string;
  date: Date;
}

export interface GetProductsResponse {
  total: number;
  products: Product[];
}
