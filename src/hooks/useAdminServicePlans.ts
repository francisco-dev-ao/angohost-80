
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  service_type: string;
  price_monthly: number;
  price_yearly: number;
  features?: Record<string, any>;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminServicePlans = () => {
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServicePlans = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('service_plans')
        .select('*')
        .order('service_type', { ascending: true })
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      
      setServicePlans(data as ServicePlan[] || []);
    } catch (error: any) {
      console.error('Error fetching service plans:', error);
      toast.error('Erro ao carregar planos de serviço');
    } finally {
      setIsLoading(false);
    }
  };

  const createServicePlan = async (servicePlan: Omit<ServicePlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('service_plans')
        .insert([servicePlan])
        .select();

      if (error) throw error;
      
      toast.success('Plano de serviço criado com sucesso');
      return data[0] as ServicePlan;
    } catch (error: any) {
      console.error('Error creating service plan:', error);
      toast.error(`Erro ao criar plano de serviço: ${error.message}`);
      throw error;
    }
  };

  const updateServicePlan = async (id: string, servicePlan: Partial<ServicePlan>) => {
    try {
      const { error } = await supabase
        .from('service_plans')
        .update(servicePlan)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Plano de serviço atualizado com sucesso');
      fetchServicePlans();
    } catch (error: any) {
      console.error('Error updating service plan:', error);
      toast.error(`Erro ao atualizar plano de serviço: ${error.message}`);
      throw error;
    }
  };

  const deleteServicePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Plano de serviço removido com sucesso');
      fetchServicePlans();
    } catch (error: any) {
      console.error('Error deleting service plan:', error);
      toast.error(`Erro ao remover plano de serviço: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    fetchServicePlans();
  }, []);

  return {
    servicePlans,
    isLoading,
    fetchServicePlans,
    createServicePlan,
    updateServicePlan,
    deleteServicePlan
  };
};
