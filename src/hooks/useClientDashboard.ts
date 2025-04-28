
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface DashboardStats {
  domains: number;
  activeServices: number;
  pendingInvoices: number;
  openTickets: number;
  notifications: number;
  services: any[];
  domains_list: any[];
  invoices: any[];
  loading: boolean;
}

export const useClientDashboard = () => {
  const { user } = useSupabaseAuth();
  const [stats, setStats] = useState<DashboardStats>({
    domains: 0,
    activeServices: 0,
    pendingInvoices: 0,
    openTickets: 0,
    notifications: 0,
    services: [],
    domains_list: [],
    invoices: [],
    loading: true,
  });

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch domains
        const { data: domains, error: domainsError } = await supabase
          .from('client_domains')
          .select('*')
          .eq('user_id', user.id)
          .limit(3)
          .order('created_at', { ascending: false });
          
        if (domainsError) throw domainsError;
        
        // Fetch services
        const { data: services, error: servicesError } = await supabase
          .from('client_services')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(2)
          .order('created_at', { ascending: false });
          
        if (servicesError) throw servicesError;
        
        // Fetch invoices
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .limit(1)
          .order('created_at', { ascending: false });
          
        if (invoicesError) throw invoicesError;
        
        // Count open tickets - Corrigido para usar { count: 'exact' }
        const { count: ticketsCount, error: ticketsError } = await supabase
          .from('client_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'open');
          
        if (ticketsError) throw ticketsError;
        
        // Count unread notifications - Corrigido para usar { count: 'exact' }
        const { count: notificationsCount, error: notificationsError } = await supabase
          .from('user_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);
          
        if (notificationsError) throw notificationsError;
        
        // Update stats state with all the fetched data
        setStats({
          domains: domains?.length || 0,
          activeServices: services?.length || 0,
          pendingInvoices: invoices?.length || 0,
          openTickets: ticketsCount || 0,
          notifications: notificationsCount || 0,
          services: services || [],
          domains_list: domains || [],
          invoices: invoices || [],
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [user]);

  return stats;
};
