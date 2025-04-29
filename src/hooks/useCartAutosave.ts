
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCartAutosave = () => {
  const { items } = useCart();
  const { user } = useSupabaseAuth();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Autosave cart when items change
  useEffect(() => {
    if (!user || items.length === 0) return;
    
    // Debounce saving to avoid too many requests
    const timer = setTimeout(() => {
      saveCartToDb();
    }, 3000); // Wait 3 seconds after last change
    
    return () => clearTimeout(timer);
  }, [items, user]);
  
  // Also save cart when user is about to leave the page
  useEffect(() => {
    if (!user) return;
    
    const handleBeforeUnload = () => {
      if (items.length > 0) {
        // This won't actually save in the beforeunload event due to async timing,
        // but we attempt it anyway
        saveCartToDb();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, items]);
  
  const saveCartToDb = async () => {
    if (!user || isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Fix: Convert CartItem[] to a plain object for JSON storage
      const cartItemsJson = JSON.parse(JSON.stringify(items));
      
      // Save to profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          cart_items: cartItemsJson, // This should now be properly stringified
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Also save to cart_abandonments for recovery
      if (items.length > 0) {
        // Fix: Convert CartItem[] to a plain object for JSON storage again
        const cartItemsForAbandonment = JSON.parse(JSON.stringify(items));
        
        const { error: cartError } = await supabase
          .from('cart_abandonments')
          .upsert({
            user_id: user.id,
            email: user.email,
            cart_items: cartItemsForAbandonment, // This should now be properly stringified
            updated_at: new Date().toISOString(),
            is_guest: false
          }, { onConflict: 'user_id' });
          
        if (cartError) throw cartError;
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving cart:', error);
      // Don't show toast to avoid disturbing the user
    } finally {
      setIsSaving(false);
    }
  };
  
  const restoreCart = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_abandonments')
        .select('cart_items')
        .eq('token', token)
        .single();
        
      if (error) throw error;
      
      if (data && data.cart_items) {
        // Logic to restore cart items would be added here
        // This requires integration with your cart context
        toast.success('Carrinho restaurado com sucesso!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error restoring cart:', error);
      toast.error('Erro ao restaurar carrinho');
      return false;
    }
  };
  
  return {
    lastSaved,
    isSaving,
    saveCart: saveCartToDb,
    restoreCart
  };
};

export default useCartAutosave;
