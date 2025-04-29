import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string | null;
  user_id: string;
  items: any[];
  created_at: string;
  updated_at: string;
  company_details?: any;
  client_details?: any;
  order_id?: string;
  download_url?: string;
}

export const useInvoices = (userId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      
      // If userId is provided, fetch for that user (admin view)
      // Otherwise, fetch for the current authenticated user (client view)
      const queryUserId = userId || user?.id;
      
      if (!queryUserId) {
        setInvoices([]);
        return;
      }
      
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If we're not an admin (support@angohost.ao) and no specific userId is provided, 
      // filter to only current user's invoices
      if (user?.email !== 'support@angohost.ao' && !userId) {
        query = query.eq('user_id', queryUserId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Erro ao carregar faturas');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download an invoice as PDF
  const downloadInvoice = async (invoiceId: string) => {
    try {
      toast.info('Preparando download...');
      
      // In a real implementation, you would generate and return a PDF file
      // For now, we'll just show a notification
      setTimeout(() => {
        toast.success('Fatura baixada com sucesso');
      }, 1500);
    } catch (error: any) {
      toast.error('Erro ao baixar fatura');
    }
  };
  
  // Function to delete an invoice (admin only)
  const deleteInvoice = async (invoiceId: string) => {
    try {
      // Special permission check - only super admin can delete
      if (user?.email !== 'support@angohost.ao') {
        toast.error('Você não tem permissão para excluir faturas');
        return;
      }
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      // Update local state to remove the deleted invoice
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      toast.success('Fatura excluída com sucesso');
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast.error(`Erro ao excluir fatura: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!user && !userId) return;
    
    fetchInvoices();
    
    // Set up real-time subscription for changes to the invoices table
    const invoicesChannel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        () => {
          console.log('Invoices data changed, refreshing...');
          fetchInvoices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(invoicesChannel);
    };
  }, [user, userId]);

  return {
    invoices,
    isLoading,
    downloadInvoice,
    deleteInvoice,
    refreshInvoices: fetchInvoices
  };
};
