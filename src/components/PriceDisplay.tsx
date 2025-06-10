
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useDiscountCalculation } from '@/hooks/useDiscountCalculation';

interface PriceDisplayProps {
  price: number;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  discountPercentage = 0, 
  size = 'md',
  showBadge = true,
  className = ''
}) => {
  const { originalPrice, discountedPrice, hasDiscount } = useDiscountCalculation(price, discountPercentage);

  const sizeClasses = {
    sm: {
      current: 'text-sm font-medium',
      original: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5'
    },
    md: {
      current: 'text-lg font-semibold',
      original: 'text-sm',
      badge: 'text-xs px-2 py-1'
    },
    lg: {
      current: 'text-2xl font-bold',
      original: 'text-base',
      badge: 'text-sm px-2.5 py-1'
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`text-gold ${sizeClasses[size].current}`}>
          ${discountedPrice.toFixed(2)}
        </span>
        
        {hasDiscount && (
          <span className={`text-gray-500 line-through ${sizeClasses[size].original}`}>
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {hasDiscount && showBadge && (
        <Badge 
          variant="destructive" 
          className={`bg-red-500 hover:bg-red-600 text-white ${sizeClasses[size].badge}`}
        >
          -{discountPercentage}%
        </Badge>
      )}
    </div>
  );
};

export default PriceDisplay;
