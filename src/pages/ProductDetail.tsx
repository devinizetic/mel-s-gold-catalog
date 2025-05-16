
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 animate-pulse h-6 w-32 bg-gray-200 rounded" />
          <SkeletonLoader type="detail" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-serif font-medium text-gray-900 mb-4">Product Not Found</h1>
          <p className="mb-8 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-gold hover:bg-gold-dark">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/products" className="flex items-center text-gray-600 hover:text-gold mb-8 transition-colors">
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Products</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain aspect-square"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-medium text-gray-900">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-4">
              <span className="text-2xl font-medium text-gold">${product.price.toFixed(2)}</span>
              <Badge variant={product.in_stock ? "outline" : "secondary"} className={product.in_stock ? "border-green-500 text-green-600" : "text-gray-500"}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {product.categories?.name || 'Uncategorized'}
              </span>
            </div>
            
            <div className="border-t border-gray-200 my-6 pt-6">
              <h2 className="font-serif font-medium text-lg mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            <div className="mt-auto pt-6">
              <p className="text-sm text-gray-500 mb-6">
                Each piece is handcrafted with care and attention to detail. 
                Due to the handmade nature, slight variations may occur, making each item unique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
