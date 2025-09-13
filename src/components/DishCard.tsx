import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf, Wheat, Zap } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { DishCustomizationDialog } from "./DishCustomizationDialog";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_promotion: boolean;
  promotion_price?: number;
  rating: number;
}

interface DishCardProps {
  dish: Dish;
}

export const DishCard = ({ dish }: DishCardProps) => {
  const { addItem } = useCart();
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  
  const finalPrice = dish.is_promotion && dish.promotion_price ? dish.promotion_price : dish.price;

  const handleAddToCart = (customizations: Record<string, any> = {}) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: finalPrice,
      quantity: 1,
      image_url: dish.image_url,
      customizations,
    });
    setIsCustomizationOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative">
          {dish.image_url && (
            <img
              src={dish.image_url}
              alt={dish.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {dish.is_promotion && (
              <Badge className="bg-red-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Promoção
              </Badge>
            )}
            {dish.is_vegan && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Leaf className="h-3 w-3 mr-1" />
                Vegano
              </Badge>
            )}
            {dish.is_vegetarian && !dish.is_vegan && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Leaf className="h-3 w-3 mr-1" />
                Vegetariano
              </Badge>
            )}
            {dish.is_gluten_free && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Wheat className="h-3 w-3 mr-1" />
                Sem Glúten
              </Badge>
            )}
          </div>
          
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{dish.rating}</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {dish.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {dish.is_promotion && dish.promotion_price && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {dish.price.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-2xl font-bold text-primary">
                R$ {finalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsCustomizationOpen(true)}
              >
                Personalizar
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-primary-glow"
                onClick={() => handleAddToCart()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DishCustomizationDialog
        dish={dish}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};