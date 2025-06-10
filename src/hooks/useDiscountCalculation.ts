
import { useMemo } from 'react';

export interface PriceCalculation {
  originalPrice: number;
  discountedPrice: number;
  hasDiscount: boolean;
  discountAmount: number;
  discountPercentage: number;
}

export const useDiscountCalculation = (price: number, discountPercentage: number = 0): PriceCalculation => {
  return useMemo(() => {
    const hasDiscount = discountPercentage > 0;
    const discountAmount = hasDiscount ? (price * discountPercentage) / 100 : 0;
    const discountedPrice = price - discountAmount;

    return {
      originalPrice: price,
      discountedPrice: hasDiscount ? discountedPrice : price,
      hasDiscount,
      discountAmount,
      discountPercentage
    };
  }, [price, discountPercentage]);
};
