
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Domain } from '@/types/admin';

export const useAdminDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      
      const { data, error, count } = await supabase
        .from('domains')
        .select('*', { count: 'exact' })
        .order('registration_date', { ascending: false });

      if (error) throw error;
      
      setDomains(data as Domain[]);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error('Erro ao carregar domínios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDomainStatus = async (domainId: string, status: 'active' | 'expired' | 'pending' | 'transferring') => {
    try {
      const { error } = await supabase
        .from('domains')
        .update({ status })
        .eq('id', domainId);

      if (error) throw error;
      
      toast.success('Status do domínio atualizado com sucesso');
      fetchDomains(); // Reload domains
    } catch (error: any) {
      toast.error('Erro ao atualizar status do domínio: ' + error.message);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return { domains, isLoading, totalCount, fetchDomains, updateDomainStatus };
};
