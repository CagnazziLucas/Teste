import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  is_promotion: boolean;
  promotion_price?: number;
}

interface DishCustomizationDialogProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizations: Record<string, any>) => void;
}

export const DishCustomizationDialog = ({ 
  dish, 
  isOpen, 
  onClose, 
  onAddToCart 
}: DishCustomizationDialogProps) => {
  const [customizations, setCustomizations] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const addOns = [
    { id: "extra_cheese", name: "Queijo Extra", price: 5.00 },
    { id: "bacon", name: "Bacon", price: 8.00 },
    { id: "extra_sauce", name: "Molho Extra", price: 2.00 },
    { id: "no_onion", name: "Sem Cebola", price: 0 },
    { id: "no_tomato", name: "Sem Tomate", price: 0 },
  ];

  const removals = [
    { id: "no_salt", name: "Sem Sal" },
    { id: "no_pepper", name: "Sem Pimenta" },
    { id: "no_garlic", name: "Sem Alho" },
  ];

  const handleCustomizationChange = (id: string, checked: boolean, name: string, price?: number) => {
    setCustomizations(prev => {
      const updated = { ...prev };
      if (checked) {
        updated[id] = { name, price: price || 0 };
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const getTotalPrice = () => {
    const basePrice = dish.is_promotion && dish.promotion_price ? dish.promotion_price : dish.price;
    const addOnsPrice = Object.values(customizations).reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    return (basePrice + addOnsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const customizationsWithNotes = {
      ...customizations,
      ...(notes && { notes: { name: "Observações", value: notes, price: 0 } }),
      quantity
    };
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(customizationsWithNotes);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizar {dish.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Quantidade</h4>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Adicionais</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addOns.map((addon) => (
                <div key={addon.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={addon.id}
                    onCheckedChange={(checked) => 
                      handleCustomizationChange(addon.id, checked as boolean, addon.name, addon.price)
                    }
                  />
                  <Label htmlFor={addon.id} className="flex-1 cursor-pointer">
                    {addon.name}
                    {addon.price > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">
                        +R$ {addon.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Remover Ingredientes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {removals.map((removal) => (
                <div key={removal.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={removal.id}
                    onCheckedChange={(checked) => 
                      handleCustomizationChange(removal.id, checked as boolean, removal.name)
                    }
                  />
                  <Label htmlFor={removal.id} className="cursor-pointer">
                    {removal.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações Especiais</Label>
            <Textarea
              id="notes"
              placeholder="Alguma observação especial para o prato?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-bold">
              Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleAddToCart}>
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};