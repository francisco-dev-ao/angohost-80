
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseOrderToOrder } from '@/utils/adminMappers';
import { Order } from '@/types/admin';

export const useAdminOrders = () => {
  const [loading, setLoading] = useState(true);

  const fetchRecentOrders = async (): Promise<Order[]> => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (ordersError) throw ordersError;
      
      return ordersData ? 
        ordersData.map((order: any) => mapSupabaseOrderToOrder(order)) 
        : [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  };
  
  const fetchOrderCounts = async () => {
    try {
      const { count: pendingOrders, error: pendingOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingOrdersError) throw pendingOrdersError;
      
      const { count: activeOrders, error: activeOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'processing');
      
      if (activeOrdersError) throw activeOrdersError;
      
      const { count: completedOrders, error: completedOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      if (completedOrdersError) throw completedOrdersError;
      
      return {
        pendingOrders: pendingOrders || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0
      };
    } catch (error) {
      console.error('Error fetching order counts:', error);
      return { pendingOrders: 0, activeOrders: 0, completedOrders: 0 };
    }
  };

  return { fetchRecentOrders, fetchOrderCounts };
};
