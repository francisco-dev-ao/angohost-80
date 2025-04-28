
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/types/admin';

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
      
      const formattedOrders: Order[] = data.map(o => ({
        id: o.id,
        userId: o.user_id,
        orderNumber: o.order_number,
        totalAmount: o.total_amount,
        status: o.status as Order['status'],
        items: o.items || [],
        createdAt: o.created_at,
        updatedAt: o.updated_at
      }));
      
      setOrders(formattedOrders);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Status do pedido atualizado com sucesso');
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao atualizar status do pedido: ' + error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, fetchOrders, updateOrderStatus };
};
