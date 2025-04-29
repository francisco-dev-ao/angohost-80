
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DomainExtension {
  id: string;
  extension: string;
  price: number;
  renewal_price?: number;
  is_popular: boolean;
  is_active: boolean;
  description?: string;
}

export const useDomainExtensions = () => {
  const [extensions, setExtensions] = useState<DomainExtension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('domain_extensions')
          .select('*')
          .eq('is_active', true)
          .order('is_popular', { ascending: false })
          .order('extension');

        if (error) throw error;
        setExtensions(data || []);
      } catch (error) {
        console.error('Error fetching domain extensions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  return { extensions, loading };
};
