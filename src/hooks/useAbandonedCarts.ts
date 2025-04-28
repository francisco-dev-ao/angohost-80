
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAbandonedCarts = () => {
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [settings, setSettings] = useState<any>(null);
  const [reminderConfigurations, setReminderConfigurations] = useState<any[]>([]);

  const fetchAbandonedCarts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('cart_abandonments')
        .select('*, profiles(full_name, email)')
        .eq('is_recovered', false);
        
      // Apply time range filter
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case '365d':
          startDate = new Date(now.setDate(now.getDate() - 365));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30));
      }
      
      query = query.gte('created_at', startDate.toISOString());
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAbandonedCarts(data || []);
    } catch (error) {
      console.error('Error fetching abandoned carts:', error);
      toast.error('Erro ao buscar carrinhos abandonados');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_abandonment_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching cart abandonment settings:', error);
      toast.error('Erro ao carregar configurações de carrinhos abandonados');
    }
  };

  const fetchReminderConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_reminder_configurations')
        .select('*, email_template:email_template_id(name), guest_email_template:guest_email_template_id(name)')
        .order('delay_hours', { ascending: true });

      if (error) throw error;
      setReminderConfigurations(data || []);
    } catch (error) {
      console.error('Error fetching reminder configurations:', error);
      toast.error('Erro ao carregar configurações de lembretes');
    }
  };

  const updateSettings = async (newSettings: any) => {
    try {
      const { data, error } = await supabase
        .from('cart_abandonment_settings')
        .update(newSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      toast.success('Configurações atualizadas com sucesso');
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
      return false;
    }
  };

  const sendManualReminder = async (cartId: string) => {
    try {
      // First, get the current notification count
      const { data: currentCart, error: fetchError } = await supabase
        .from('cart_abandonments')
        .select('notification_count')
        .eq('id', cartId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new notification count
      const newCount = (currentCart?.notification_count || 0) + 1;
      
      // Update the cart with new notification count
      const { error } = await supabase
        .from('cart_abandonments')
        .update({
          last_notification_at: new Date().toISOString(),
          notification_count: newCount
        })
        .eq('id', cartId);

      if (error) throw error;
      
      toast.success('Lembrete enviado com sucesso');
      fetchAbandonedCarts();
      return true;
    } catch (error: any) {
      console.error('Error sending manual reminder:', error);
      toast.error('Erro ao enviar lembrete: ' + error.message);
      return false;
    }
  };
  
  const recoverAbandonedCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('cart_abandonments')
        .update({ 
          is_recovered: true,
          recovered_at: new Date().toISOString()
        })
        .eq('id', cartId);

      if (error) throw error;
      
      toast.success('Carrinho marcado como recuperado');
      fetchAbandonedCarts();
      return true;
    } catch (error: any) {
      console.error('Error recovering cart:', error);
      toast.error('Erro ao recuperar carrinho: ' + error.message);
      return false;
    }
  };

  useEffect(() => {
    fetchAbandonedCarts();
    fetchSettings();
    fetchReminderConfigurations();
  }, [timeRange]);

  return {
    abandonedCarts,
    isLoading,
    timeRange,
    setTimeRange,
    settings,
    reminderConfigurations,
    fetchAbandonedCarts,
    updateSettings,
    sendManualReminder,
    recoverAbandonedCart
  };
};
