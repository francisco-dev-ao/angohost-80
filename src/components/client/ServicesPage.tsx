
import React, { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Server } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface ClientService {
  id: string;
  name: string;
  description: string;
  service_type: string;
  status: string;
  created_at: string;
  renewal_date: string;
  price_monthly: number;
  price_yearly: number;
  control_panel_url?: string;
  control_panel_username?: string;
}

const ServicesPage = () => {
  const { user } = useSupabaseAuth();
  const [services, setServices] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('client_services')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServices(data || []);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast.error('Erro ao carregar serviços: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const accessControlPanel = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('URL do painel de controle não disponível');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meus Serviços</h2>
        <p className="text-muted-foreground">
          Gerencie seus serviços de hospedagem, email e outros produtos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Ativos</CardTitle>
          <CardDescription>
            Seus serviços contratados e informações de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Server className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Você ainda não possui serviços ativos em sua conta.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Explorar Serviços
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Próxima Renovação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                          {service.name}
                          {service.description && (
                            <span className="ml-2 text-muted-foreground text-sm truncate max-w-xs">
                              ({service.description})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{service.service_type}</TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>{formatPrice(service.price_monthly)}/mês</TableCell>
                      <TableCell>
                        {format(new Date(service.renewal_date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        {service.control_panel_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => accessControlPanel(service.control_panel_url)}
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Acessar Painel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais de Acesso</CardTitle>
          <CardDescription>
            Detalhes de login para seus serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Nenhuma credencial disponível</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>URL do Painel</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id + "-cred"}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        {service.control_panel_url ? (
                          <a 
                            href={service.control_panel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {service.control_panel_url}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{service.control_panel_username || "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(service.created_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;
