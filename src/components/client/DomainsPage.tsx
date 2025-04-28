
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Domain {
  id: string;
  domain_name: string;
  registration_date: string;
  expiry_date: string;
  status: string;
  is_locked: boolean;
  auto_renew?: boolean;
  whois_privacy?: boolean;
  nameservers?: {
    ns1?: string;
    ns2?: string;
    ns3?: string;
    ns4?: string;
  };
}

const DomainsPage = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('client_domains')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDomains(data || []);
      } catch (error: any) {
        console.error('Error fetching domains:', error);
        toast.error('Erro ao carregar domínios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDomains();
  }, [user]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Domínios</h1>
        <Button onClick={() => navigate("/domains")}>
          Registrar Novo Domínio
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando domínios...</div>
      ) : domains.length > 0 ? (
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id}>
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
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Gerenciar DNS
                    </Button>
                    <Button variant="outline" size="sm">
                      Configurar Nameservers
                    </Button>
                    <Button variant="outline" size="sm">
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
