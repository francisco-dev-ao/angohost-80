
import { useState, useEffect } from 'react';
import { executeQuery } from '@/integrations/mysql/client';
import { toast } from 'sonner';

export interface DashboardStats {
  totalSales: number;
  activeDomains: number;
  activeHostings: number;
  newRegistrationsToday: number;
  newRegistrationsWeek: number;
  pendingInvoices: number;
  newTickets: number;
}

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
        const { data: activeDomains, error: domainsError } = await executeQuery(
          "SELECT COUNT(*) as count FROM domains WHERE status = 'active'"
        );

        if (domainsError) throw domainsError;
        
        // Fetch active hosting services count
        const { data: activeHostings, error: hostingsError } = await executeQuery(
          "SELECT COUNT(*) as count FROM client_services WHERE status = 'active' AND service_type = 'hosting'"
        );

        if (hostingsError) throw hostingsError;
          
        // Fetch pending invoices
        const { data: pendingInvoices, error: invoicesError } = await executeQuery(
          "SELECT COUNT(*) as count FROM invoices WHERE status = 'pending'"
        );

        if (invoicesError) throw invoicesError;

        // Fetch new tickets
        const { data: newTickets, error: ticketsError } = await executeQuery(
          "SELECT COUNT(*) as count FROM tickets WHERE status = 'open'"
        );

        if (ticketsError) throw ticketsError;

        // Calculate today's date and a week ago for registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString();
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        const weekAgoString = weekAgo.toISOString();

        // Fetch new registrations today
        const { data: newRegistrationsToday, error: registrationsTodayError } = await executeQuery(
          "SELECT COUNT(*) as count FROM users WHERE created_at >= ?",
          [todayString]
        );

        if (registrationsTodayError) throw registrationsTodayError;

        // Fetch new registrations this week
        const { data: newRegistrationsWeek, error: registrationsWeekError } = await executeQuery(
          "SELECT COUNT(*) as count FROM users WHERE created_at >= ?",
          [weekAgoString]
        );

        if (registrationsWeekError) throw registrationsWeekError;

        // Calculate total sales from paid invoices
        const { data: paidInvoices, error: paidInvoicesError } = await executeQuery(
          "SELECT SUM(amount) as total FROM invoices WHERE status = 'paid'"
        );

        if (paidInvoicesError) throw paidInvoicesError;

        setStats({
          totalSales: paidInvoices?.[0]?.total || 0,
          activeDomains: activeDomains?.[0]?.count || 0,
          activeHostings: activeHostings?.[0]?.count || 0,
          newRegistrationsToday: newRegistrationsToday?.[0]?.count || 0,
          newRegistrationsWeek: newRegistrationsWeek?.[0]?.count || 0,
          pendingInvoices: pendingInvoices?.[0]?.count || 0,
          newTickets: newTickets?.[0]?.count || 0
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
