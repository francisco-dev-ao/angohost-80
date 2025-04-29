
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export interface ClientService {
  id: string;
  name: string;
  description?: string;
  service_type: string;
  status: string;
  price_monthly: number;
  price_yearly: number;
  renewal_date: string;
  created_at: string;
  control_panel_url?: string;
  auto_renew: boolean;
}

export const useClientServices = () => {
  const [services, setServices] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchServices = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch regular services
      const { data: regularServices, error: servicesError } = await supabase
        .from('client_services')
        .select('*')
        .eq('user_id', user.id);

      if (servicesError) throw servicesError;
      
      // Fetch recent invoices and show them as services
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5); // Limit to 5 most recent invoices

      if (invoicesError) throw invoicesError;

      // Fetch recent orders and show them as services
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5); // Limit to 5 most recent orders

      if (ordersError) throw ordersError;

      // Convert invoices to client service format
      const invoiceServices: ClientService[] = (invoices || []).map(invoice => ({
        id: `invoice-${invoice.id}`,
        name: `Fatura #${invoice.invoice_number}`,
        description: 'Fatura de serviços',
        service_type: 'invoice',
        status: invoice.status === 'paid' ? 'active' : invoice.status,
        price_monthly: 0,
        price_yearly: invoice.amount,
        renewal_date: invoice.due_date,
        created_at: invoice.created_at,
        auto_renew: false,
      }));

      // Convert orders to client service format
      const orderServices: ClientService[] = (orders || []).map(order => ({
        id: `order-${order.id}`,
        name: `Pedido #${order.order_number}`,
        description: 'Pedido de serviços',
        service_type: 'order',
        status: order.status === 'completed' ? 'active' : order.status,
        price_monthly: 0,
        price_yearly: order.total_amount,
        renewal_date: new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear() + 1)).toISOString(),
        created_at: order.created_at,
        auto_renew: false,
      }));

      // Combine all services
      const allServices = [
        ...(regularServices || []),
        ...invoiceServices,
        ...orderServices
      ];

      setServices(allServices);
    } catch (error: any) {
      console.error('Error fetching client services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const renewService = async (serviceId: string) => {
    try {
      // Check if this is an invoice or order service (these can't be renewed)
      if (serviceId.startsWith('invoice-') || serviceId.startsWith('order-')) {
        toast.info('Este item não pode ser renovado diretamente.');
        return;
      }

      toast.info('Processando renovação...');
      // Simulate renewal process
      setTimeout(() => {
        toast.success('Serviço renovado com sucesso!');
      }, 1500);
    } catch (error) {
      toast.error('Erro ao renovar serviço');
    }
  };

  const toggleAutoRenew = async (serviceId: string, currentStatus: boolean) => {
    try {
      // Check if this is an invoice or order service (these can't have auto-renew)
      if (serviceId.startsWith('invoice-') || serviceId.startsWith('order-')) {
        toast.info('Renovação automática não disponível para este item.');
        return;
      }

      const { error } = await supabase
        .from('client_services')
        .update({ auto_renew: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      
      setServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { ...service, auto_renew: !currentStatus } 
            : service
        )
      );

      toast.success(`Renovação automática ${!currentStatus ? 'ativada' : 'desativada'}`);
    } catch (error: any) {
      console.error('Error toggling auto-renew:', error);
      toast.error('Erro ao alterar renovação automática');
    }
  };

  useEffect(() => {
    if (!user) return;
    
    fetchServices();
    
    // Set up a real-time subscription to client_services table
    const servicesChannel = supabase
      .channel('client-services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_services',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Client services changed, refreshing...');
          fetchServices();
        }
      )
      .subscribe();
    
    // Subscribe to invoice changes as well
    const invoicesChannel = supabase
      .channel('client-invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Invoices changed, refreshing services...');
          fetchServices();
        }
      )
      .subscribe();

    // Subscribe to order changes
    const ordersChannel = supabase
      .channel('client-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Orders changed, refreshing services...');
          fetchServices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  return { services, loading, renewService, toggleAutoRenew };
};
