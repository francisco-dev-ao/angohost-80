
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
  items: any;
  created_at: string;
  updated_at?: string;
  company_details?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    vat: string;
  } | null | any;
  client_details?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    document: string;
  } | null | any;
  order_id?: string | null;
  download_url?: string | null;
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
          .select('*, orders(order_number, status, payment_status)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const typedInvoices: Invoice[] = data.map(invoice => ({
            id: invoice.id,
            invoice_number: invoice.invoice_number,
            amount: invoice.amount,
            status: invoice.status,
            due_date: invoice.due_date,
            payment_date: invoice.payment_date,
            user_id: invoice.user_id,
            items: invoice.items,
            created_at: invoice.created_at,
            updated_at: invoice.updated_at,
            company_details: invoice.company_details,
            client_details: invoice.client_details,
            order_id: invoice.order_id,
            download_url: invoice.download_url
          }));
          
          setInvoices(typedInvoices);
        }
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
          table: 'invoices',
          filter: `user_id=eq.${user.id}`
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

  // Function to generate and download an invoice
  const downloadInvoice = async (invoiceId: string) => {
    try {
      // First, try to get existing download URL
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('download_url, invoice_number')
        .eq('id', invoiceId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // If download URL exists, use it - otherwise trigger generation
      if (invoice.download_url) {
        window.open(invoice.download_url, '_blank');
      } else {
        toast.info(`Gerando download da fatura ${invoice.invoice_number}...`);
        
        // In a real implementation, you would call an edge function to generate the PDF
        // For now, we'll simulate a generation and update with a mock URL
        setTimeout(async () => {
          const mockUrl = `https://angohosting.ao/invoices/${invoice.invoice_number}.pdf`;
          
          // Update the invoice with the download URL
          const { error: updateError } = await supabase
            .from('invoices')
            .update({ download_url: mockUrl })
            .eq('id', invoiceId);
          
          if (updateError) throw updateError;
          
          // Open the "generated" PDF
          window.open(mockUrl, '_blank');
          toast.success('Fatura gerada com sucesso');
        }, 2000);
      }
    } catch (error: any) {
      toast.error('Erro ao baixar a fatura: ' + error.message);
    }
  };

  return { invoices, isLoading, downloadInvoice };
};
