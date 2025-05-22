
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  supabase,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/types';
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
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
    setCategoryName('');
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setImagePreview(category.image_url || null);
    setImageFile(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast({
        title: 'Campo requerido',
        description: 'Por favor ingrese un nombre para la categoría.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload image if provided
      let imageUrl = selectedCategory?.image_url;
      if (imageFile) {
        imageUrl = await uploadCategoryImage(imageFile);
      }
      
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, { 
          name: categoryName,
          ...(imageUrl !== selectedCategory.image_url ? { image_url: imageUrl } : {})
        });
        
        setCategories((prev) => 
          prev.map((c) => (c.id === selectedCategory.id ? { ...c, name: categoryName, image_url: imageUrl } : c))
        );
        
        toast({
          title: 'Categoría actualizada',
          description: 'La categoría ha sido actualizada exitosamente.',
        });
      } else {
        const newCategory = await createCategory({ name: categoryName, image_url: imageUrl });
        setCategories((prev) => [...prev, newCategory]);
        
        toast({
          title: 'Categoría creada',
          description: 'La categoría ha sido creada exitosamente.',
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la categoría.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
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
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium">Gestión de Categorías</h1>
            <p className="text-gray-500">Agregar, editar o eliminar categorías</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin">Volver al Panel</Link>
            </Button>
            <Button 
              onClick={handleCreateCategory}
              className="bg-gold hover:bg-gold-dark"
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="w-24">
                        {category.image_url ? (
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img 
                              src={category.image_url} 
                              alt={category.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                            <Image size={24} className="text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(category)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-16 text-center">
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
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="categoryName" className="text-sm font-medium">Nombre</label>
              <Input
                id="categoryName"
                placeholder="Nombre de la categoría"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen</label>
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
                  <Input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="imageUpload">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="cursor-pointer" 
                      as="span"
                    >
                      {imagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold-dark"
                disabled={isUploading}
              >
                {isUploading ? 'Guardando...' : selectedCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
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
