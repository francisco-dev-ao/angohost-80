
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { castInvoiceData } from '@/utils/adminMappers';
import { Invoice } from '@/hooks/useInvoices';

export const useAdminInvoices = () => {
  const fetchRecentInvoices = async (): Promise<Invoice[]> => {
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (invoicesError) throw invoicesError;
      
      return castInvoiceData(invoicesData || []);
    } catch (error) {
      console.error('Error fetching recent invoices:', error);
      return [];
    }
  };
  
  const fetchInvoiceCounts = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching invoice counts:', error);
      return { pendingInvoices: 0, paidInvoices: 0 };
    }
  };
  
  const fetchTotalRevenue = async (): Promise<number> => {
    try {
      const { data: revenueData, error: revenueError } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid');
      
      if (revenueError) throw revenueError;
      
      return revenueData?.reduce((acc, invoice) => acc + Number(invoice.amount), 0) || 0;
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return 0;
    }
  };

  return { fetchRecentInvoices, fetchInvoiceCounts, fetchTotalRevenue };
};
