
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  const createReminderConfiguration = async (config: any) => {
    try {
      const { data, error } = await supabase
        .from('cart_reminder_configurations')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      fetchReminderConfigurations();
      return true;
    } catch (error) {
      console.error('Error creating reminder configuration:', error);
      return false;
    }
  };

  const updateReminderConfiguration = async (id: string, config: any) => {
    try {
      const { error } = await supabase
        .from('cart_reminder_configurations')
        .update(config)
        .eq('id', id);

      if (error) throw error;
      fetchReminderConfigurations();
      return true;
    } catch (error) {
      console.error('Error updating reminder configuration:', error);
      return false;
    }
  };

  const deleteReminderConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_reminder_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReminderConfigurations();
      return true;
    } catch (error) {
      console.error('Error deleting reminder configuration:', error);
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
      fetchAbandonedCarts();
      return true;
    } catch (error) {
      console.error('Error sending manual reminder:', error);
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
    createReminderConfiguration,
    updateReminderConfiguration,
    deleteReminderConfiguration,
    sendManualReminder,
  };
};
