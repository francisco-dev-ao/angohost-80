
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type HostingService = {
  id: string;
  name: string;
  username: string;
  domain?: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending' | 'cancelled';
  expiryDate: string;
  creationDate: string;
  userId: string;
  userEmail?: string;
  controlPanelUrl?: string;
};

export const useAdminHosting = () => {
  const [services, setServices] = useState<HostingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: clientServices, error: servicesError } = await supabase
        .from('client_services')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      
      // Transform data to match our HostingService type
      const formattedServices: HostingService[] = clientServices.map(service => {
        // Convert status to one of the allowed types or default to 'pending' if not valid
        const validStatus = ['active', 'suspended', 'pending', 'cancelled'].includes(service.status || '') 
          ? (service.status as 'active' | 'suspended' | 'pending' | 'cancelled')
          : 'pending';
        
        // Safely access email property with optional chaining and type check
        let userEmail: string | undefined = undefined;
        if (service.profiles && typeof service.profiles === 'object' && service.profiles !== null) {
          userEmail = (service.profiles as { email?: string })?.email;
        }
        
        return {
          id: service.id,
          name: service.name,
          username: service.control_panel_username || 'N/A',
          domain: service.description || undefined,
          plan: service.service_type || 'Standard',
          status: validStatus,
          expiryDate: service.renewal_date,
          creationDate: service.created_at,
          userId: service.user_id,
          userEmail: userEmail,
          controlPanelUrl: service.control_panel_url
        };
      });
      
      setServices(formattedServices);
    } catch (err: any) {
      console.error('Error fetching hosting services:', err);
      setError(err.message);
      toast.error('Erro ao carregar serviços de hospedagem: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceStatus = async (serviceId: string, status: 'active' | 'suspended' | 'pending' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('client_services')
        .update({ status })
        .eq('id', serviceId);

      if (error) throw error;
      
      toast.success('Status do serviço atualizado com sucesso');
      fetchServices(); // Reload services
    } catch (err: any) {
      toast.error('Erro ao atualizar status: ' + err.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, isLoading, error, fetchServices, updateServiceStatus };
};
