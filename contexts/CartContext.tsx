import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../utils/supabase/types';
import { useAuth } from './AuthContext';
import { apiCall } from '../utils/api';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (cartItems: CartItem[]) => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.pricing?.sellingPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const refreshCart = async () => {
    if (!user || user.role !== 'customer') {
      setItems([]);
      return;
    }

    setLoading(true);
    const response = await apiCall<{ items: CartItem[] }>('/cart/get', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id }),
    });

    if (response.success && response.data) {
      setItems(response.data.items || []);
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addItem = async (productId: string, quantity: number) => {
    if (!user) return;

    const response = await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id, productId, quantity }),
    });

    if (response.success) {
      await refreshCart();
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    const response = await apiCall('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id, productId }),
    });

    if (response.success) {
      await refreshCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const response = await apiCall('/cart/update', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id, productId, quantity }),
    });

    if (response.success) {
      await refreshCart();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const response = await apiCall('/cart/clear', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id }),
    });

    if (response.success) {
      setItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        totalAmount: calculateTotal(items),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
