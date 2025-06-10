
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SkeletonLoader from '@/components/SkeletonLoader';
import WhatsAppButton from '@/components/WhatsAppButton';
import PriceDisplay from '@/components/PriceDisplay';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { useDiscountCalculation } from '@/hooks/useDiscountCalculation';
import Navbar from '@/components/Navbar';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

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

  const { hasDiscount, discountAmount } = useDiscountCalculation(
    product?.price || 0, 
    product?.discount_percentage || 0
  );

  const handleAddToCart = () => {
    if (!product || !product.in_stock) return;
    
    addItem(product);
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó al carrito`,
    });
  };

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
          <h1 className="text-2xl font-serif font-medium text-gray-900 mb-4">Producto No Encontrado</h1>
          <p className="mb-8 text-gray-600">El producto que buscas no existe o ha sido eliminado.</p>
          <Button asChild className="bg-gold hover:bg-gold-dark">
            <Link to="/products">Volver a Productos</Link>
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
          <span className="ml-1">Volver a Productos</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
          <div className="bg-gray-50 rounded-xl overflow-hidden relative">
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-red-500 text-white text-sm px-3 py-1.5 font-medium">
                  -{product.discount_percentage}% OFF
                </Badge>
              </div>
            )}
            
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover aspect-square"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <span className="text-gray-400">No hay imagen disponible</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 mb-4">{product.name}</h1>
              
              <div className="mb-4">
                <PriceDisplay 
                  price={product.price} 
                  discountPercentage={product.discount_percentage}
                  size="lg"
                  showBadge={false}
                />
                
                {hasDiscount && (
                  <p className="text-green-600 font-medium mt-2">
                    ¡Ahorras ${discountAmount.toFixed(2)}!
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <Badge variant={product.in_stock ? "outline" : "secondary"} className={product.in_stock ? "border-green-500 text-green-600" : "text-gray-500"}>
                  {product.in_stock ? 'En Stock' : 'Agotado'}
                </Badge>
                
                <span className="text-sm text-gray-500">
                  {product.categories?.name || 'Sin categoría'}
                </span>
              </div>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
            
            {product.in_stock && (
              <div className="pt-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white px-8 py-3 text-lg"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
