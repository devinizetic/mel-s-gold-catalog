
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  category_id: z.string().min(1, 'La categoría es requerida'),
  in_stock: z.boolean(),
  is_featured: z.boolean(),
  is_in_catalog: z.boolean(),
  discount_percentage: z.number().min(0, 'El descuento no puede ser negativo').max(100, 'El descuento no puede ser mayor a 100'),
  image: z.instanceof(File).optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productSchema>;
