
import { useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const useCartData = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // If user is logged in, try to load cart from database
        if (user) {
          const { data, error } = await supabase
            .from('shopping_carts')
            .select('items')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (data) {
            setItems(data.items || []);
          } else {
            // Load from local storage if no DB record
            const localCart = localStorage.getItem('cart');
            if (localCart) {
              setItems(JSON.parse(localCart));
            }
          }
        } else {
          // If not logged in, load from local storage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            setItems(JSON.parse(localCart));
          }
        }
      } catch (err: any) {
        console.error('Error loading cart:', err);
        setError(err);
        
        // Try local storage as fallback
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [user]);
  
  const saveCart = async (newItems: CartItem[]) => {
    // Always save to local storage
    localStorage.setItem('cart', JSON.stringify(newItems));
    
    // If user is logged in, also save to database
    if (user) {
      try {
        const { error } = await supabase
          .from('shopping_carts')
          .upsert({
            user_id: user.id,
            items: newItems,
            updated_at: new Date()
          }, {
            onConflict: 'user_id'
          });
          
        if (error) throw error;
      } catch (err) {
        console.error('Error saving cart to database:', err);
        // Continue even if DB save fails, as we have local storage backup
      }
    }
  };

  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(i => i.id === item.id);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      newItems = [...items, item];
    }
    
    setItems(newItems);
    saveCart(newItems);
  };
  
  const updateItemPrice = (itemId: string, newPrice: number) => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const newItems = [...items];
    newItems[itemIndex] = {...newItems[itemIndex], price: newPrice};
    
    setItems(newItems);
    saveCart(newItems);
  };

  const removeFromCart = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    saveCart(newItems);
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  return { 
    items, 
    isLoading, 
    error, 
    addToCart, 
    removeFromCart, 
    clearCart,
    updateItemPrice
  };
};
