
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onOpenChange, children }) => {
  const { items, updateQuantity, removeItem, total, clearCart, generateWhatsAppMessage } = useCart();

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "1234567890"; // Replace with actual WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-gold">Carrito de Compras</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      {item.product.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-gold font-medium">${item.product.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </Button>
                        
                        <span className="text-sm min-w-[2rem] text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700 ml-auto"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg">Total:</span>
                  <span className="font-bold text-xl text-gold">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <FaWhatsapp size={16} className="mr-2" />
                    Enviar Pedido por WhatsApp
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    Limpiar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
