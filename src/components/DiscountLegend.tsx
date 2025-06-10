
import React from 'react';

interface DiscountLegendProps {
  discountType: string; // Changed from union type to string
  hasDiscount: boolean;
  className?: string;
}

const DiscountLegend: React.FC<DiscountLegendProps> = ({ 
  discountType, 
  hasDiscount, 
  className = '' 
}) => {
  if (!hasDiscount) return null;

  const getLegendText = (type: string): string => {
    switch (type) {
      case 'cash':
        return 'Pagando en efectivo';
      case 'card':
        return 'Pagando con tarjeta';
      case 'all':
        return 'Con todos los medios de pago';
      default:
        return 'Con todos los medios de pago';
    }
  };

  return (
    <p className={`text-xs text-gray-600 italic ${className}`}>
      {getLegendText(discountType)}
    </p>
  );
};

export default DiscountLegend;
