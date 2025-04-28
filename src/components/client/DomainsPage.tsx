
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Domain } from "@/types/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DomainsPage = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('client_domains')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDomains(data as Domain[] || []);
      } catch (error: any) {
        console.error('Error fetching domains:', error);
        setError('Erro ao carregar domínios. Por favor, tente novamente.');
        toast.error('Erro ao carregar domínios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDomains();

    // Set up real-time subscription
    const channel = supabase
      .channel('client_domains_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_domains',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Real-time domain update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setDomains(prev => [payload.new as Domain, ...prev]);
            toast.success('Novo domínio adicionado');
          } else if (payload.eventType === 'UPDATE') {
            setDomains(prev => prev.map(domain => 
              domain.id === payload.new.id ? payload.new as Domain : domain
            ));
            toast.success('Informações de domínio atualizadas');
          } else if (payload.eventType === 'DELETE') {
            setDomains(prev => prev.filter(domain => domain.id !== payload.old.id));
            toast.info('Domínio removido');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRenewDomain = async (domainId: string) => {
    toast.info('Processando renovação...', { duration: 2000 });
    // In a real app, this would initiate the renewal workflow
  };

  const handleManageDns = (domainId: string) => {
    navigate(`/client/domains/${domainId}/dns`);
  };

  const handleConfigureNameservers = (domainId: string) => {
    navigate(`/client/domains/${domainId}/nameservers`);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'active': 'bg-green-500',
      'expired': 'bg-red-500',
      'pending': 'bg-yellow-500',
      'transferring': 'bg-blue-500',
      'default': 'bg-gray-500'
    };

    const badgeClass = statusClasses[status as keyof typeof statusClasses] || statusClasses.default;
    
    return (
      <Badge className={badgeClass}>
        {status}
      </Badge>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Domínios</h1>
        <Button onClick={() => navigate("/domains")}>
          Registrar Novo Domínio
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Carregando domínios...</p>
        </div>
      ) : domains.length > 0 ? (
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{domain.domain_name}</CardTitle>
                    <CardDescription>
                      Registrado em: {format(new Date(domain.registration_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(domain.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data de Expiração:</span>
                    <span className="font-medium">
                      {format(new Date(domain.expiry_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Auto Renovação:</span>
                    <span className="font-medium">
                      {domain.auto_renew ? 'Ativada' : 'Desativada'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Privacidade WHOIS:</span>
                    <span className="font-medium">
                      {domain.whois_privacy ? 'Ativada' : 'Desativada'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bloqueio de Transferência:</span>
                    <span className="font-medium">
                      {domain.is_locked ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleManageDns(domain.id)}>
                      Gerenciar DNS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleConfigureNameservers(domain.id)}>
                      Configurar Nameservers
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRenewDomain(domain.id)}>
                      Renovar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhum domínio encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui domínios registrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => navigate("/domains")}>
              Registrar um Domínio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainsPage;
