
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  in_stock: boolean;
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
