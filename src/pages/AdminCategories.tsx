import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  supabase,
  getCategories,
  deleteCategory
} from '@/lib/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogScrollArea,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types';
import AdminCategoryForm from '@/components/AdminCategoryForm';
import SkeletonLoader from '@/components/SkeletonLoader';
import Navbar from '@/components/Navbar';
import { Image } from 'lucide-react';

const AdminCategories: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setIsCheckingAuth(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría ha sido eliminada exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleFormSuccess = async () => {
    setIsDialogOpen(false);
    
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error reloading categories:', error);
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
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
            <h1 className="text-2xl sm:text-3xl font-serif font-medium">Gestión de Categorías</h1>
            <p className="text-gray-500 text-sm sm:text-base">Agregar, editar o eliminar categorías</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/admin">Volver al Panel</Link>
            </Button>
            <Button 
              onClick={handleCreateCategory}
              className="bg-gold hover:bg-gold-dark w-full sm:w-auto"
            >
              Agregar Categoría
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="w-24">
                          {category.image_url ? (
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden">
                              <img 
                                src={category.image_url} 
                                alt={category.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-md flex items-center justify-center">
                              <Image size={20} className="text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              className="w-full sm:w-auto"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(category)}
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
                <h3 className="text-xl font-medium text-gray-700 mb-2">No hay categorías</h3>
                <p className="text-gray-500 mb-6">Comience agregando su primera categoría.</p>
                <Button onClick={handleCreateCategory} className="bg-gold hover:bg-gold-dark">
                  Agregar Categoría
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </DialogTitle>
          </DialogHeader>
          <DialogScrollArea>
            <AdminCategoryForm
              category={selectedCategory || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la categoría "{categoryToDelete?.name}". No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
