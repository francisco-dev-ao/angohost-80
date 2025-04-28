
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types/admin';
import { toast } from 'sonner';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    activeDomains: 0,
    activeHostings: 0,
    newRegistrationsToday: 0,
    newRegistrationsWeek: 0,
    pendingInvoices: 0,
    newTickets: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Fetch active domains count
        const { count: activeDomains, error: domainsError } = await supabase
          .from('domains')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        if (domainsError) throw domainsError;

        // Fetch active products (hosting) count
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (productsError) throw productsError;
          
        const activeHostings = products?.filter(p => 
          p.category_id === products.find(cat => cat.name === 'Hosting')?.id
        ).length || 0;

        // Fetch pending invoices
        const { count: pendingInvoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (invoicesError) throw invoicesError;

        // Fetch new tickets
        const { count: newTickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');

        if (ticketsError) throw ticketsError;

        // Calculate today's date and a week ago for registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        // Fetch new registrations today
        const { count: newRegistrationsToday, error: registrationsTodayError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        if (registrationsTodayError) throw registrationsTodayError;

        // Fetch new registrations this week
        const { count: newRegistrationsWeek, error: registrationsWeekError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString());

        if (registrationsWeekError) throw registrationsWeekError;

        // Calculate total sales from paid invoices
        const { data: paidInvoices, error: paidInvoicesError } = await supabase
          .from('invoices')
          .select('amount')
          .eq('status', 'paid');

        if (paidInvoicesError) throw paidInvoicesError;

        const totalSales = paidInvoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;

        setStats({
          totalSales,
          activeDomains: activeDomains || 0,
          activeHostings,
          newRegistrationsToday: newRegistrationsToday || 0,
          newRegistrationsWeek: newRegistrationsWeek || 0,
          pendingInvoices: pendingInvoices || 0,
          newTickets: newTickets || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Erro ao carregar estatísticas do painel');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return { stats, isLoading };
};
