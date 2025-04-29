
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

// Definição do tipo para serviços
export interface ClientService {
  id: string;
  name: string;
  description: string;
  service_type: string;
  status: string;
  price_yearly: number;
  renewal_date: string;
  auto_renew: boolean;
  control_panel_url?: string;
}

export const useClientServices = () => {
  const [services, setServices] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('client_services')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setServices(data || []);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast.error('Erro ao carregar serviços: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
    
    // Set up real-time listener
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
          fetchServices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(servicesChannel);
    };
  }, [user]);
  
  const renewService = async (serviceId: string) => {
    try {
      // Create a renewal order
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          status: 'pending',
          order_number: `RNW-${Date.now()}`,
          total_amount: services.find(s => s.id === serviceId)?.price_yearly || 0,
          items: [{ service_id: serviceId, type: 'renewal' }]
        });
        
      if (error) throw error;
      toast.success('Pedido de renovação enviado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao renovar serviço: ' + error.message);
    }
  };
  
  const toggleAutoRenew = async (serviceId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('client_services')
        .update({ auto_renew: !currentValue })
        .eq('id', serviceId);
        
      if (error) throw error;
      
      toast.success(currentValue 
        ? 'Renovação automática desativada' 
        : 'Renovação automática ativada'
      );
    } catch (error: any) {
      toast.error('Erro ao atualizar configuração: ' + error.message);
    }
  };
  
  return {
    services,
    loading,
    renewService,
    toggleAutoRenew
  };
};
