
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DomainExtension {
  id: string;
  extension: string;
  price: number;
  renewal_price?: number;
  is_popular: boolean;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useAdminDomainExtensions = () => {
  const [domainExtensions, setDomainExtensions] = useState<DomainExtension[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDomainExtensions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('domain_extensions')
        .select('*')
        .order('extension');

      if (error) throw error;
      
      setDomainExtensions(data as DomainExtension[] || []);
    } catch (error: any) {
      console.error('Error fetching domain extensions:', error);
      toast.error('Erro ao carregar extensões de domínio');
    } finally {
      setIsLoading(false);
    }
  };

  const createDomainExtension = async (domainExtension: Omit<DomainExtension, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('domain_extensions')
        .insert([domainExtension])
        .select();

      if (error) throw error;
      
      toast.success('Extensão de domínio criada com sucesso');
      return data[0] as DomainExtension;
    } catch (error: any) {
      console.error('Error creating domain extension:', error);
      toast.error(`Erro ao criar extensão de domínio: ${error.message}`);
      throw error;
    }
  };

  const updateDomainExtension = async (id: string, domainExtension: Partial<DomainExtension>) => {
    try {
      const { error } = await supabase
        .from('domain_extensions')
        .update(domainExtension)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Extensão de domínio atualizada com sucesso');
      fetchDomainExtensions();
    } catch (error: any) {
      console.error('Error updating domain extension:', error);
      toast.error(`Erro ao atualizar extensão de domínio: ${error.message}`);
      throw error;
    }
  };

  const deleteDomainExtension = async (id: string) => {
    try {
      const { error } = await supabase
        .from('domain_extensions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Extensão de domínio removida com sucesso');
      fetchDomainExtensions();
    } catch (error: any) {
      console.error('Error deleting domain extension:', error);
      toast.error(`Erro ao remover extensão de domínio: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    fetchDomainExtensions();
  }, []);

  return {
    domainExtensions,
    isLoading,
    fetchDomainExtensions,
    createDomainExtension,
    updateDomainExtension,
    deleteDomainExtension
  };
};
