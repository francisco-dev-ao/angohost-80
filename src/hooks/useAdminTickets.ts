
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Ticket } from '@/types/admin';

export const useAdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTickets(data as Ticket[]);
    } catch (error: any) {
      toast.error('Erro ao carregar tickets: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: 'open' | 'in-progress' | 'closed') => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
      
      toast.success('Status do ticket atualizado com sucesso');
      fetchTickets(); // Reload tickets
    } catch (error: any) {
      toast.error('Erro ao atualizar status do ticket: ' + error.message);
    }
  };

  const assignTicket = async (ticketId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ assigned_to: adminId })
        .eq('id', ticketId);

      if (error) throw error;
      
      toast.success('Ticket atribuído com sucesso');
      fetchTickets(); // Reload tickets
    } catch (error: any) {
      toast.error('Erro ao atribuir ticket: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, isLoading, fetchTickets, updateTicketStatus, assignTicket };
};
