-- Create dishes table with filters and categories
CREATE TABLE public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('entradas', 'principais', 'sobremesas')),
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_promotion BOOLEAN DEFAULT false,
  promotion_price DECIMAL(10,2),
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on dishes
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to dishes (read-only)
CREATE POLICY "Dishes are viewable by everyone" 
ON public.dishes 
FOR SELECT 
USING (available = true);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('pix', 'credit_card', 'debit_card')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_session_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customizations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can create their own order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Insert sample dishes
INSERT INTO public.dishes (name, description, price, category, is_vegetarian, is_vegan, is_gluten_free, is_promotion, rating) VALUES
('Salada Mediterrânea', 'Mix de folhas verdes, tomate cereja, abacate e molho balsâmico', 28.90, 'entradas', true, true, true, false, 4.8),
('Bruschetta Italiana', 'Pão italiano com tomate, manjericão e azeite extra virgem', 24.90, 'entradas', true, false, false, true, 4.5),
('Salmão Grelhado', 'Salmão grelhado com ervas finas e legumes assados', 65.90, 'principais', false, false, true, false, 4.9),
('Burger Gourmet', 'Hambúrguer artesanal com bacon, queijo e batatas', 42.90, 'principais', false, false, false, false, 4.6),
('Risotto de Cogumelos', 'Risotto cremoso com mix de cogumelos frescos', 38.90, 'principais', true, false, true, true, 4.7),
('Mousse de Chocolate', 'Mousse cremoso com frutas vermelhas e hortelã', 22.90, 'sobremesas', true, false, true, false, 4.7),
('Tiramisù', 'Sobremesa italiana tradicional com café e mascarpone', 26.90, 'sobremesas', true, false, false, false, 4.8);

-- Update promotion prices for promotional items
UPDATE public.dishes 
SET promotion_price = 19.90 
WHERE name = 'Bruschetta Italiana';

UPDATE public.dishes 
SET promotion_price = 32.90 
WHERE name = 'Risotto de Cogumelos';

-- Create trigger for updated_at
CREATE TRIGGER update_dishes_updated_at
BEFORE UPDATE ON public.dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;