
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 h-full animate-fade-in"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img 
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg font-medium text-gray-900 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <span className="font-medium text-gold">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {(product as any).categories?.name || 'Uncategorized'}
          </span>
          <Badge variant={product.in_stock ? "outline" : "secondary"} className={product.in_stock ? "border-green-500 text-green-600" : "text-gray-500"}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
