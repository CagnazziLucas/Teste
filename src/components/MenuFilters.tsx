import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Wheat, Zap, X } from "lucide-react";

interface MenuFiltersProps {
  selectedCategory: string;
  selectedFilters: string[];
  onCategoryChange: (category: string) => void;
  onFilterToggle: (filter: string) => void;
  onClearFilters: () => void;
}

const categories = [
  { id: "all", name: "Todos" },
  { id: "entradas", name: "Entradas" },
  { id: "principais", name: "Pratos Principais" },
  { id: "sobremesas", name: "Sobremesas" },
];

const filters = [
  { id: "is_vegetarian", name: "Vegetariano", icon: Leaf, color: "bg-green-100 text-green-800" },
  { id: "is_vegan", name: "Vegano", icon: Leaf, color: "bg-green-100 text-green-800" },
  { id: "is_gluten_free", name: "Sem Glúten", icon: Wheat, color: "bg-blue-100 text-blue-800" },
  { id: "is_promotion", name: "Promoções", icon: Zap, color: "bg-red-100 text-red-800" },
];

export const MenuFilters = ({
  selectedCategory,
  selectedFilters,
  onCategoryChange,
  onFilterToggle,
  onClearFilters,
}: MenuFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? "bg-gradient-to-r from-primary to-primary-glow" 
                  : ""
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Filtros</h3>
          {selectedFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilters.includes(filter.id);
            
            return (
              <Badge
                key={filter.id}
                variant={isSelected ? "default" : "secondary"}
                className={`cursor-pointer transition-all ${
                  isSelected ? "bg-primary text-primary-foreground" : filter.color
                }`}
                onClick={() => onFilterToggle(filter.id)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {filter.name}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {selectedFilters.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedFilters.length} filtro{selectedFilters.length > 1 ? 's' : ''} ativo{selectedFilters.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};