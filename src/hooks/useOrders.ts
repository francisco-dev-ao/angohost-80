
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_status: string;
  items: any;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        toast.error('Erro ao carregar pedidos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  return { orders, loading };
};
