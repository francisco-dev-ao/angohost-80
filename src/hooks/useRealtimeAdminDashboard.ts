import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/types/admin';
import { Invoice } from '@/hooks/useInvoices';
import { Json } from '@/integrations/supabase/types';

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

interface SupabaseOrder {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any;
  created_at: string;
  updated_at: string;
}

const mapSupabaseOrderToOrder = (order: SupabaseOrder): Order => ({
  id: order.id,
  userId: order.user_id,
  orderNumber: order.order_number,
  status: order.status as "pending" | "processing" | "completed" | "canceled",
  totalAmount: order.total_amount,
  items: Array.isArray(order.items) ? order.items : [],
  createdAt: order.created_at,
  updatedAt: order.updated_at
});

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

  const fetchRecentOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (ordersError) throw ordersError;
    
    return ordersData ? 
      ordersData.map((order: SupabaseOrder) => mapSupabaseOrderToOrder(order)) 
      : [];
  };
  
  const fetchOrderCounts = async () => {
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
  };
  
  const fetchRecentInvoices = async () => {
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (invoicesError) throw invoicesError;
    
    const invoices = (invoicesData || []) as Invoice[];
    
    return invoices;
  };
  
  const fetchInvoiceCounts = async () => {
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
    
    return {
      pendingInvoices: pendingInvoices || 0,
      paidInvoices: paidInvoices || 0
    };
  };
  
  const fetchTotalRevenue = async () => {
    const { data: revenueData, error: revenueError } = await supabase
      .from('invoices')
      .select('amount')
      .eq('status', 'paid');
    
    if (revenueError) throw revenueError;
    
    return revenueData?.reduce((acc, invoice) => acc + Number(invoice.amount), 0) || 0;
  };
  
  const fetchPaymentMethodCount = async () => {
    const { count: paymentMethodCount, error: paymentMethodError } = await supabase
      .from('payment_methods')
      .select('*', { count: 'exact', head: true });
    
    if (paymentMethodError) throw paymentMethodError;
    
    return paymentMethodCount || 0;
  };

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
  
  const setupRealtimeListeners = () => {
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
      
    return { ordersChannel, invoicesChannel, paymentMethodsChannel };
  };

  useEffect(() => {
    fetchDashboardStats();

    const channels = setupRealtimeListeners();

    return () => {
      supabase.removeChannel(channels.ordersChannel);
      supabase.removeChannel(channels.invoicesChannel);
      supabase.removeChannel(channels.paymentMethodsChannel);
    };
  }, []);

  return { stats, loading, refreshStats: fetchDashboardStats };
};
