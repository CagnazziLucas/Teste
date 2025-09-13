import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { CheckoutDialog } from "./CheckoutDialog";

export const CartSidebar = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {state.itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {state.itemCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Carrinho de Compras</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              {state.items.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {Object.keys(item.customizations).length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Personalizações:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <li key={key}>{key}: {value}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold">
                          R$ {item.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {state.items.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {state.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Finalizar Pedido
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      <CheckoutDialog 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};