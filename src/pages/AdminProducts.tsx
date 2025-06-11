import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  supabase,
  getProducts,
  getCategories,
  deleteProduct,
} from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogScrollArea,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Product, Category } from "@/types";
import AdminProductForm from "@/components/AdminProductForm";
import SkeletonLoader from "@/components/SkeletonLoader";
import PriceDisplay from "@/components/PriceDisplay";
import Navbar from "@/components/Navbar";

const AdminProducts: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setIsCheckingAuth(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load products or categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSuccess = async () => {
    setIsDialogOpen(false);

    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error reloading products:", error);
    }
  };

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Efectivo";
      case "card":
        return "Tarjeta";
      case "all":
        return "Todos";
      default:
        return "Todos";
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium">
              Gestión de Productos
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Agregar, editar o eliminar productos del catálogo
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="w-full sm:w-auto order-3 sm:order-1">
              <Link to="/admin">Volver al Panel</Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto order-2">
              <Link to="/admin/categories">Gestionar Categorías</Link>
            </Button>
            <Button
              onClick={handleCreateProduct}
              className="bg-gold hover:bg-gold-dark w-full sm:w-auto order-1 sm:order-3"
            >
              Agregar Producto
            </Button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px]">Imagen</TableHead>
                      <TableHead className="min-w-[150px]">Nombre</TableHead>
                      <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                      <TableHead className="min-w-[100px]">Precio</TableHead>
                      <TableHead className="hidden md:table-cell">Descuento</TableHead>
                      <TableHead className="hidden lg:table-cell">Tipo Descuento</TableHead>
                      <TableHead className="hidden sm:table-cell">Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Destacado</TableHead>
                      <TableHead className="hidden lg:table-cell">En Catálogo</TableHead>
                      <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
                                No imagen
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              {(product as any).categories?.name || "Sin categoría"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {(product as any).categories?.name || "Sin categoría"}
                        </TableCell>
                        <TableCell>
                          <PriceDisplay
                            price={product.price}
                            discountPercentage={
                              product.discount_percentage || 0
                            }
                            size="sm"
                            showBadge={false}
                          />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.discount_percentage > 0 ? (
                            <Badge className="bg-red-500 text-white">
                              -{product.discount_percentage}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Sin descuento
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {product.discount_percentage > 0 ? (
                            <Badge variant="outline" className="text-xs">
                              {getDiscountTypeLabel(
                                product.discount_type || "all"
                              )}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={product.in_stock ? "outline" : "secondary"}
                            className={
                              product.in_stock
                                ? "border-green-500 text-green-600"
                                : "text-gray-500"
                            }
                          >
                            {product.in_stock ? "En Stock" : "Agotado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              product.is_featured ? "default" : "outline"
                            }
                            className={
                              product.is_featured
                                ? "bg-gold hover:bg-gold-dark border-gold"
                                : ""
                            }
                          >
                            {product.is_featured ? "Destacado" : "No destacado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              product.is_in_catalog ? "default" : "secondary"
                            }
                            className={
                              product.is_in_catalog
                                ? "bg-blue-500 hover:bg-blue-600"
                                : ""
                            }
                          >
                            {product.is_in_catalog ? "Visible" : "Oculto"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="w-full sm:w-auto"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(product)}
                              className="w-full sm:w-auto"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-16 text-center px-4">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No hay productos
                </h3>
                <p className="text-gray-500 mb-6">
                  Comience agregando su primer producto al catálogo.
                </p>
                <Button
                  onClick={handleCreateProduct}
                  className="bg-gold hover:bg-gold-dark"
                >
                  Agregar Producto
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Producto" : "Crear Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <DialogScrollArea>
            <AdminProductForm
              product={selectedProduct || undefined}
              categories={categories}
              onSuccess={handleFormSuccess}
            />
          </DialogScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente {productToDelete?.name}. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
