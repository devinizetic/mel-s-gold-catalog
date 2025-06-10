
import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/types";
import { useDiscountCalculation } from "@/hooks/useDiscountCalculation";

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  generateWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate total using discounted prices
  const total = items.reduce((sum, item) => {
    const { discountedPrice } = useDiscountCalculation(
      item.product.price, 
      item.product.discount_percentage || 0
    );
    return sum + discountedPrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppMessage = useCallback(() => {
    if (items.length === 0) return "";

    let message = "*Pedido de Las Joyas de Mel*\n\n";

    items.forEach((item, index) => {
      const { discountedPrice, hasDiscount } = useDiscountCalculation(
        item.product.price, 
        item.product.discount_percentage || 0
      );

      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      
      if (hasDiscount) {
        message += `   Precio original: $${item.product.price.toFixed(2)}\n`;
        message += `   Precio con descuento: $${discountedPrice.toFixed(2)}\n`;
        message += `   Descuento: -${item.product.discount_percentage}%\n`;
      } else {
        message += `   Precio unitario: $${discountedPrice.toFixed(2)}\n`;
      }
      
      message += `   Subtotal: $${(discountedPrice * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total: $${total.toFixed(2)}*\n\n`;
    message += "¡Gracias por tu compra!";
    return message;
  }, [items, total]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    generateWhatsAppMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
