
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: any[];
  created_at: string;
  updated_at?: string;
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data as Order[]);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Status do pedido atualizado com sucesso');
      fetchOrders(); // Reload orders
    } catch (error: any) {
      toast.error('Erro ao atualizar status do pedido: ' + error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, fetchOrders, updateOrderStatus };
};
