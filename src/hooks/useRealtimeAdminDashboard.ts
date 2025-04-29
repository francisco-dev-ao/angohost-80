
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/types/admin';
import { Invoice } from '@/hooks/useInvoices';
import { useAdminOrders } from './admin/useAdminOrders';
import { useAdminInvoices } from './admin/useAdminInvoices';
import { usePaymentMethods } from './admin/usePaymentMethods';
import { useAdminRealtimeListeners } from './admin/useAdminRealtimeListeners';

interface AdminDashboardStats {
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentInvoices: Invoice[];
  paymentMethodCount: number;
}

export const useRealtimeAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentInvoices: [],
    paymentMethodCount: 0
  });

  const { fetchRecentOrders, fetchOrderCounts } = useAdminOrders();
  const { fetchRecentInvoices, fetchInvoiceCounts, fetchTotalRevenue } = useAdminInvoices();
  const { fetchPaymentMethodCount } = usePaymentMethods();
  const { setupRealtimeListeners } = useAdminRealtimeListeners();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [
        recentOrders,
        orderCounts,
        recentInvoices,
        invoiceCounts,
        totalRevenue,
        paymentMethodCount
      ] = await Promise.all([
        fetchRecentOrders(),
        fetchOrderCounts(),
        fetchRecentInvoices(),
        fetchInvoiceCounts(),
        fetchTotalRevenue(),
        fetchPaymentMethodCount()
      ]);
      
      setStats({
        ...orderCounts,
        ...invoiceCounts,
        totalRevenue,
        recentOrders,
        recentInvoices,
        paymentMethodCount
      });
    } catch (error: any) {
      console.error('Error fetching admin dashboard stats:', error);
      toast.error('Erro ao carregar estatísticas do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    const channels = setupRealtimeListeners(fetchDashboardStats);

    return () => {
      supabase.removeChannel(channels.ordersChannel);
      supabase.removeChannel(channels.invoicesChannel);
      supabase.removeChannel(channels.paymentMethodsChannel);
    };
  }, []);

  return { stats, loading, refreshStats: fetchDashboardStats };
};
