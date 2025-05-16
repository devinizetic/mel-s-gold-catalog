
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@/types';
import { createProduct, updateProduct, uploadProductImage } from '@/lib/supabaseClient';

interface AdminProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, categories, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isInCatalog, setIsInCatalog] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategoryId(product.category_id);
      setInStock(product.in_stock);
      setIsFeatured(product.is_featured || false);
      setIsInCatalog(product.is_in_catalog !== false); // Default to true if undefined
      setImagePreview(product.image_url);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || !categoryId) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor complete todos los campos requeridos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = product?.image_url || '';
      
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }
      
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        in_stock: inStock,
        is_featured: isFeatured,
        is_in_catalog: isInCatalog,
        image_url: imageUrl,
      };
      
      if (product?.id) {
        await updateProduct(product.id, productData);
        toast({
          title: 'Producto actualizado',
          description: 'El producto ha sido actualizado exitosamente.',
        });
      } else {
        await createProduct(productData);
        toast({
          title: 'Producto creado',
          description: 'El producto ha sido creado exitosamente.',
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Algo salió mal.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del producto"
          required
          className="min-h-[120px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={categoryId} 
            onValueChange={setCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center space-x-2">
          <Switch 
            id="in-stock" 
            checked={inStock}
            onCheckedChange={setInStock}
          />
          <Label htmlFor="in-stock">En Stock</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="is-featured" 
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
          <Label htmlFor="is-featured">Destacado</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="is-in-catalog" 
            checked={isInCatalog}
            onCheckedChange={setIsInCatalog}
          />
          <Label htmlFor="is-in-catalog">Visible en Catálogo</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Imagen del Producto</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
            <img 
              src={imagePreview} 
              alt="Product preview" 
              className="h-40 w-auto object-contain border rounded-md" 
            />
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="bg-gold hover:bg-gold-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </form>
  );
};

export default AdminProductForm;
