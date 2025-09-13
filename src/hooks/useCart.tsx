import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  customizations: Record<string, any>;
  total: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'total'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations)
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.total, 0),
          itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        };
      }

      const newItem: CartItem = {
        ...action.payload,
        total: action.payload.price * action.payload.quantity,
      };

      const newItems = [...state.items, newItem];
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: newItems.reduce((count, item) => count + item.quantity, 0),
      };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: filteredItems.reduce((count, item) => count + item.quantity, 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity, total: item.price * action.payload.quantity }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'total'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addItem = (item: Omit<CartItem, 'total'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};