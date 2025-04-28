
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Service } from '@/types/client';

export const useClientServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('client_services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setServices(data as Service[] || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };
  
  const renewService = async (serviceId: string) => {
    if (!user) return;
    
    try {
      // Get current service
      const { data: service, error: fetchError } = await supabase
        .from('client_services')
        .select('*')
        .eq('id', serviceId)
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Calculate new renewal date (add 1 year)
      const currentRenewal = new Date(service.renewal_date);
      const newRenewalDate = new Date(currentRenewal);
      newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
      
      // Update service
      const { error: updateError } = await supabase
        .from('client_services')
        .update({
          renewal_date: newRenewalDate.toISOString(),
          last_renewed_at: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      // Create order for the renewal
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: `RENEW-${Date.now().toString().substring(0, 10)}`,
          total_amount: service.price_yearly,
          status: 'pending',
          payment_status: 'pending',
          items: [{
            name: `Renovação: ${service.name}`,
            price: service.price_yearly,
            quantity: 1
          }]
        });
        
      if (orderError) throw orderError;
      
      toast.success('Solicitação de renovação enviada com sucesso');
      fetchServices();
    } catch (error: any) {
      console.error('Error renewing service:', error);
      toast.error('Erro ao renovar serviço');
    }
  };
  
  const toggleAutoRenew = async (serviceId: string, autoRenew: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('client_services')
        .update({ auto_renew: !autoRenew })
        .eq('id', serviceId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast.success(`Renovação automática ${!autoRenew ? 'ativada' : 'desativada'}`);
      fetchServices();
    } catch (error: any) {
      console.error('Error toggling auto-renew:', error);
      toast.error('Erro ao alterar configuração de renovação automática');
    }
  };

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  return { services, loading, fetchServices, renewService, toggleAutoRenew };
};
