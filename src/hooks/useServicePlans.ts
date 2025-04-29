
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  service_type: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, any>;
  is_popular: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useServicePlans = (serviceType?: string) => {
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('service_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly');
        
        if (serviceType) {
          query = query.eq('service_type', serviceType);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Transform the features from Json to Record<string, any>
        const transformedData = (data || []).map(item => ({
          ...item,
          features: typeof item.features === 'string' 
            ? JSON.parse(item.features) 
            : item.features || {}
        }));
        
        setPlans(transformedData as ServicePlan[]);
      } catch (error) {
        console.error('Error fetching service plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [serviceType]);

  return { plans, loading };
};
