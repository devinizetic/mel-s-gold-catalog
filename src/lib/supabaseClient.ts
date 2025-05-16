
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export { supabase };

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
}

export async function getFeaturedProducts(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return data || [];
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  return data[0];
}

export async function updateProduct(id: string, product: any) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return data[0];
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
  
  return true;
}

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);
  
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
