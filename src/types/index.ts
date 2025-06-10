
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  in_stock: boolean;
  is_featured: boolean;
  is_in_catalog: boolean;
  discount_percentage: number;
  discount_type: string; // Changed from union type to string to match database
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image_url?: string;
}

export interface User {
  id: string;
  email: string;
  role?: string;
}
