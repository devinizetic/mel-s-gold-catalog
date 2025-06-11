import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Product, Category } from "@/types";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/supabaseClient";
import { productSchema, ProductFormData } from "@/schemas/productSchema";

interface AdminProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  categories,
  onSuccess,
}) => {
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: "",
      in_stock: true,
      is_featured: false,
      is_in_catalog: true,
      discount_percentage: 0,
      discount_type: "all",
      image: "",
    },
  });

  const watchPrice = form.watch("price");
  const watchDiscount = form.watch("discount_percentage");

  const discountedPrice = useMemo(() => {
    if (watchDiscount > 0 && watchPrice > 0) {
      const discount = (watchPrice * watchDiscount) / 100;
      return watchPrice - discount;
    }
    return watchPrice;
  }, [watchPrice, watchDiscount]);
  useEffect(() => {
    if (product) {
      const validDiscountTypes = ["cash", "card", "all"] as const;
      const discountType = validDiscountTypes.includes(
        product.discount_type as any
      )
        ? (product.discount_type as "cash" | "card" | "all")
        : "all";

      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        in_stock: product.in_stock,
        is_featured: product.is_featured || false,
        is_in_catalog: product.is_in_catalog !== false,
        discount_percentage: product.discount_percentage || 0,
        discount_type: discountType,
        image: "",
      });
    }
  }, [product, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      let imageUrl = product?.image_url || "";

      if (data.image instanceof File) {
        imageUrl = await uploadProductImage(data.image);
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        in_stock: data.in_stock,
        is_featured: data.is_featured,
        is_in_catalog: data.is_in_catalog,
        discount_percentage: data.discount_percentage,
        discount_type: data.discount_type,
        image_url: imageUrl,
      };

      if (product?.id) {
        await updateProduct(product.id, productData);
        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado exitosamente.",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Producto creado",
          description: "El producto ha sido creado exitosamente.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Algo salió mal.",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del producto"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Original ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Porcentaje de descuento (0-100%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Descuento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos los medios</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Método de pago para aplicar descuento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchDiscount > 0 && watchPrice > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Vista previa del precio
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg font-bold text-green-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${watchPrice.toFixed(2)}
                  </span>
                  <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                    -{watchDiscount}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">
                  Ahorro: ${((watchPrice * watchDiscount) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="in_stock"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>En Stock</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Destacado</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_in_catalog"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Visible en Catálogo</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Imagen del Producto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file || "");
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />

              {product?.image_url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Imagen actual:</p>
                  <img
                    src={product.image_url}
                    alt="Product preview"
                    className="h-40 w-auto object-contain border rounded-md"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-gold hover:bg-gold-dark"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Guardando..."
            : product
            ? "Actualizar Producto"
            : "Crear Producto"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminProductForm;
