
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'El nombre es muy largo'),
  image: z.instanceof(File).optional().or(z.literal('')),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
