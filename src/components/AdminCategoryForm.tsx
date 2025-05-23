
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Image } from 'lucide-react';
import { Category } from '@/types';
import { createCategory, updateCategory, uploadCategoryImage } from '@/lib/supabaseClient';
import { categorySchema, CategoryFormData } from '@/schemas/categorySchema';

interface AdminCategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({ 
  category, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      image: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        image: '',
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let imageUrl = category?.image_url;
      
      if (data.image instanceof File) {
        imageUrl = await uploadCategoryImage(data.image);
      }
      
      const categoryData = {
        name: data.name,
        ...(imageUrl && { image_url: imageUrl }),
      };
      
      if (category) {
        await updateCategory(category.id, categoryData);
        toast({
          title: 'Categoría actualizada',
          description: 'La categoría ha sido actualizada exitosamente.',
        });
      } else {
        await createCategory(categoryData);
        toast({
          title: 'Categoría creada',
          description: 'La categoría ha sido creada exitosamente.',
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar la categoría.',
        variant: 'destructive',
      });
    }
  };

  const selectedImage = form.watch('image');
  const imagePreview = selectedImage instanceof File ? URL.createObjectURL(selectedImage) : category?.image_url;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la categoría" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Previsualización" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file || '');
                      }}
                      {...field}
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-gold hover:bg-gold-dark"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminCategoryForm;
