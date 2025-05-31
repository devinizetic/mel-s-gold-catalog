
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SkeletonLoader from '@/components/SkeletonLoader';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Product, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const productsData = await getProducts();
        const filteredProducts = productsData.filter(product => product.is_in_catalog);
        setProducts(filteredProducts);
        
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by category
      const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
      
      // Filter by search query
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Debounced search to improve performance
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    // Update URL search params to reflect selected category
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-2">Nuestra Colección</h1>
            <p className="text-gray-600">Descubre joyas únicas para cada ocasión especial</p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full md:w-64 transition-all duration-200 focus:shadow-md"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse mb-6 h-10 bg-gray-200 rounded-md w-full" />
        ) : (
          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        )}
        
        {isLoading ? (
          <SkeletonLoader type="card" count={8} />
        ) : filteredProducts.length > 0 ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
            style={{
              transform: 'translateZ(0)', // Enable hardware acceleration
              willChange: 'transform', // Optimize for animations
            }}
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="transform transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
                style={{
                  animationDelay: `${index * 50}ms`, // Stagger animation
                  transform: 'translateZ(0)', // Hardware acceleration for each card
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-6">
              Intenta cambiar los criterios de búsqueda o el filtro de categoría.
            </p>
            <Button
              onClick={handleClearFilters}
              className="bg-gold hover:bg-gold-dark transition-all duration-200 hover:shadow-md transform hover:scale-105"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Products;
