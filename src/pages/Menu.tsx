import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartProvider } from "@/hooks/useCart";
import { CartSidebar } from "@/components/CartSidebar";
import { DishCard } from "@/components/DishCard";
import { MenuFilters } from "@/components/MenuFilters";
import { OrderTracking } from "@/components/OrderTracking";

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

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error } = await supabase
          .from('dishes')
          .select('*')
          .eq('available', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDishes(data || []);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredDishes = dishes.filter(dish => {
    // Category filter
    if (selectedCategory !== "all" && dish.category !== selectedCategory) {
      return false;
    }

    // Dietary filters
    if (selectedFilters.length > 0) {
      return selectedFilters.every(filter => {
        return dish[filter as keyof Dish] === true;
      });
    }

    return true;
  });

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        {/* Header */}
        <header className="bg-card/95 backdrop-blur border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Cardápio Digital</h1>
                <p className="text-sm text-muted-foreground">Restaurante Gourmet</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'menu' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('menu')}
                >
                  Cardápio
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('orders')}
                >
                  Meus Pedidos
                </Button>
              </div>
              
              {activeTab === 'menu' && <CartSidebar />}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {activeTab === 'menu' ? (
            <>
              {/* Filters */}
              <div className="mb-8">
                <MenuFilters
                  selectedCategory={selectedCategory}
                  selectedFilters={selectedFilters}
                  onCategoryChange={setSelectedCategory}
                  onFilterToggle={handleFilterToggle}
                  onClearFilters={() => setSelectedFilters([])}
                />
              </div>

              {/* Results Info */}
              {(selectedCategory !== "all" || selectedFilters.length > 0) && (
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {filteredDishes.length} prato{filteredDishes.length !== 1 ? 's' : ''} encontrado{filteredDishes.length !== 1 ? 's' : ''}
                    {selectedCategory !== "all" && ` em "${selectedCategory}"`}
                    {selectedFilters.length > 0 && ` com os filtros selecionados`}
                  </p>
                </div>
              )}

              {/* Dishes Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48 mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum prato encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou escolher outra categoria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedFilters([]);
                    }}
                  >
                    Ver Todos os Pratos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <OrderTracking />
          )}
        </div>
      </div>
    </CartProvider>
  );
};

export default Menu;