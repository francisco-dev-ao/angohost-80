
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartData } from '@/hooks/useCartData';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { DomainOwnershipData } from '@/types/cart';

export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  basePrice: number;
  type?: string;
  domain?: string;
  description?: string;
  ownershipData?: DomainOwnershipData;
  contactProfileId?: string | null;
  years?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateItemPrice: (itemId: string, newPrice: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSupabaseAuth();
  const { items, isLoading, error, addToCart, removeFromCart, clearCart, updateItemPrice } = useCartData();

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateItemPrice,
        isLoading,
        error,
        isAuthenticated: !!user
      }}
    >
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
