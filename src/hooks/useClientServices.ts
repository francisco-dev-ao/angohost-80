
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
      const { data, error } = await supabase
        .from('client_services')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching client services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const renewService = async (serviceId: string) => {
    try {
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
      
    return () => {
      supabase.removeChannel(servicesChannel);
    };
  }, [user]);

  return { services, loading, renewService, toggleAutoRenew };
};
