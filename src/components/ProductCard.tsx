
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.in_stock) return;
    
    addItem(product);
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó al carrito`,
    });
  };

  return (
    <div 
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-full animate-fade-in hover:border-gold/30"
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden', // Smoother animations
        perspective: '1000px',
      }}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image_url ? (
            <img 
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              style={{
                transform: 'translateZ(0)', // Hardware acceleration for images
                willChange: 'transform',
              }}
              loading="lazy" // Improve performance
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 transition-colors duration-300 group-hover:bg-gray-300">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-medium text-gray-900 group-hover:text-gold transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <span className="font-medium text-gold whitespace-nowrap ml-2">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </Link>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500 transition-colors duration-200">
              {(product as any).categories?.name || 'Sin categoría'}
            </span>
            <Badge 
              variant={product.in_stock ? "outline" : "secondary"} 
              className={`transition-all duration-200 ${
                product.in_stock 
                  ? "border-green-500 text-green-600 w-fit hover:bg-green-50" 
                  : "text-gray-500 w-fit"
              }`}
            >
              {product.in_stock ? 'En Stock' : 'Agotado'}
            </Badge>
          </div>
          
          {product.in_stock && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-gold hover:bg-gold-dark text-white transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
