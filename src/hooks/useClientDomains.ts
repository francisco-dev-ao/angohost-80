
import { useState, useEffect } from 'react';
import { getDomainsByUserId, updateDomain } from '@/models/domain';
import { useAuth } from '@/hooks/mysql/useAuth';
import { toast } from 'sonner';
import { Domain } from '@/models/domain';

export const useClientDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDomains = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await getDomainsByUserId(user.id);

      if (error) throw error;
      setDomains(data as Domain[] || []);
    } catch (error: any) {
      console.error('Error fetching domains:', error);
      toast.error('Erro ao carregar domínios');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRenew = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await updateDomain(domainId, { auto_renew: !currentValue });

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, auto_renew: !currentValue };
        }
        return domain;
      }));

      toast.success(`Renovação automática ${!currentValue ? 'ativada' : 'desativada'}`);
    } catch (error: any) {
      console.error('Error toggling auto renew:', error);
      toast.error('Erro ao atualizar configuração de renovação automática');
    }
  };

  const toggleWhoisPrivacy = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await updateDomain(domainId, { whois_privacy: !currentValue });

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, whois_privacy: !currentValue };
        }
        return domain;
      }));

      toast.success(`Proteção WHOIS ${!currentValue ? 'ativada' : 'desativada'}`);
    } catch (error: any) {
      console.error('Error toggling WHOIS privacy:', error);
      toast.error('Erro ao atualizar configuração de proteção WHOIS');
    }
  };

  const toggleLock = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await updateDomain(domainId, { is_locked: !currentValue });

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, is_locked: !currentValue };
        }
        return domain;
      }));

      toast.success(`Domínio ${!currentValue ? 'bloqueado' : 'desbloqueado'} para transferência`);
    } catch (error: any) {
      console.error('Error toggling domain lock:', error);
      toast.error('Erro ao atualizar configuração de bloqueio');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  return { domains, loading, fetchDomains, toggleAutoRenew, toggleWhoisPrivacy, toggleLock };
};
