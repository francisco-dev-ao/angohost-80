
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/types/admin';
import { Invoice } from '@/hooks/useInvoices';

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

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with counts by status
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      // Count orders by status
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

      // Fetch invoices with counts by status
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (invoicesError) throw invoicesError;

      // Count invoices by status
      const { count: pendingInvoices, error: pendingInvoicesError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingInvoicesError) throw pendingInvoicesError;
      
      const { count: paidInvoices, error: paidInvoicesError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'paid');
      
      if (paidInvoicesError) throw paidInvoicesError;

      // Calculate total revenue from paid invoices
      const { data: revenueData, error: revenueError } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid');
      
      if (revenueError) throw revenueError;
      
      const totalRevenue = revenueData?.reduce((acc, invoice) => acc + Number(invoice.amount), 0) || 0;

      // Get payment method count
      const { count: paymentMethodCount, error: paymentMethodError } = await supabase
        .from('payment_methods')
        .select('*', { count: 'exact', head: true });
      
      if (paymentMethodError) throw paymentMethodError;

      setStats({
        pendingOrders: pendingOrders || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0,
        pendingInvoices: pendingInvoices || 0,
        paidInvoices: paidInvoices || 0,
        totalRevenue,
        recentOrders: orders || [],
        recentInvoices: invoices || [],
        paymentMethodCount: paymentMethodCount || 0
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

    // Set up real-time listeners for orders and invoices
    const ordersChannel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('admin-dashboard-invoices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    const paymentMethodsChannel = supabase
      .channel('admin-dashboard-payment-methods')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_methods'
        },
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(paymentMethodsChannel);
    };
  }, []);

  return { stats, loading, refreshStats: fetchDashboardStats };
};
