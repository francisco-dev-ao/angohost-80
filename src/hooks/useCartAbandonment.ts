
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export const useCartAbandonment = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const [savedCarts, setSavedCarts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);

  // Fetch cart abandonment settings
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_abandonment_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error: any) {
      console.error('Error fetching cart abandonment settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's saved carts
  const fetchSavedCarts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_carts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedCarts(data || []);
    } catch (error: any) {
      console.error('Error fetching saved carts:', error);
    }
  };

  // Create a new saved cart
  const saveCart = async (name: string, isPublic: boolean = false) => {
    if (!user || items.length === 0) {
      toast.error('Não é possível salvar um carrinho vazio');
      return null;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_carts')
        .insert({
          user_id: user.id,
          cart_items: items,
          name,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Carrinho salvo com sucesso');
      fetchSavedCarts(); // Refresh saved carts list
      return data;
    } catch (error: any) {
      toast.error('Erro ao salvar carrinho: ' + error.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a saved cart
  const deleteSavedCart = async (cartId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_carts')
        .delete()
        .eq('id', cartId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Carrinho excluído com sucesso');
      fetchSavedCarts(); // Refresh saved carts list
    } catch (error: any) {
      toast.error('Erro ao excluir carrinho: ' + error.message);
    }
  };

  // Load a saved cart
  const loadSavedCart = async (cartId: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('saved_carts')
        .select('*')
        .eq('id', cartId)
        .single();

      if (error) throw error;
      
      return data.cart_items;
    } catch (error: any) {
      toast.error('Erro ao carregar carrinho salvo: ' + error.message);
      return null;
    }
  };

  // Track cart abandonment for logged-in users
  const trackCartAbandonment = async () => {
    if (!user || items.length === 0) return;

    try {
      // Check if user already has an abandoned cart
      const { data: existingCart, error: fetchError } = await supabase
        .from('cart_abandonments')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_recovered', false)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingCart) {
        // Update existing abandoned cart
        const { error: updateError } = await supabase
          .from('cart_abandonments')
          .update({
            cart_items: items,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCart.id);

        if (updateError) throw updateError;
      } else {
        // Create new abandoned cart
        const token = await generateToken();
        const { error: insertError } = await supabase
          .from('cart_abandonments')
          .insert({
            user_id: user.id,
            email: user.email,
            cart_items: items,
            token,
            is_guest: false
          });

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error tracking cart abandonment:', error);
    }
  };

  // Generate a unique token
  const generateToken = async () => {
    try {
      const { data, error } = await supabase
        .rpc('generate_cart_token');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating token:', error);
      return Math.random().toString(36).substring(2, 15);
    }
  };

  // Log cart action for analytics
  const logCartAction = async (action: string, itemDetails: any) => {
    try {
      await supabase
        .from('cart_logs')
        .insert({
          user_id: user?.id || null,
          email: user?.email || null,
          action,
          item_details: itemDetails
        });
    } catch (error) {
      console.error('Error logging cart action:', error);
    }
  };

  // Fetch admin stats for abandoned carts (admin only)
  const fetchAbandonedCarts = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_abandonments')
        .select('*')
        .eq('is_recovered', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAbandonedCarts(data || []);
    } catch (error: any) {
      console.error('Error fetching abandoned carts:', error);
    }
  };

  // Load effects
  useEffect(() => {
    fetchSettings();
    if (user) {
      fetchSavedCarts();
    }
  }, [user]);

  // Track cart abandonment when cart items change
  useEffect(() => {
    if (user && items.length > 0) {
      // Debounce to avoid too many DB calls
      const timer = setTimeout(() => {
        trackCartAbandonment();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(items), user]);

  return {
    settings,
    isLoading,
    savedCarts,
    isSaving,
    abandonedCarts,
    saveCart,
    deleteSavedCart,
    loadSavedCart,
    logCartAction,
    fetchAbandonedCarts,
    fetchSavedCarts
  };
};
