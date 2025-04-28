
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string | null;
  user_id: string;
  items: any; // Changed from any[] to any to accommodate Json type from Supabase
  created_at: string;
  updated_at?: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Convert the data to match the Invoice type
        const typedInvoices: Invoice[] = data?.map(invoice => ({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.amount,
          status: invoice.status,
          due_date: invoice.due_date,
          payment_date: invoice.payment_date,
          user_id: invoice.user_id,
          items: invoice.items,
          created_at: invoice.created_at
        })) || [];
        
        setInvoices(typedInvoices);
      } catch (error: any) {
        toast.error('Erro ao carregar faturas: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchInvoices();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchInvoices(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { invoices, isLoading };
};
