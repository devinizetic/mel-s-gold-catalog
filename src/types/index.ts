
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
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  role?: string;
}
