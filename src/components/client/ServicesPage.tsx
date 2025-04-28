
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
import { ExternalLink, Server, Mail, Globe, Loader2, AlertTriangle } from "lucide-react";
import { Service } from "@/types/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ServicesPage = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('client_services')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setServices(data as Service[] || []);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError('Erro ao carregar serviços. Por favor, tente novamente.');
        toast.error('Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();

    // Set up real-time subscription
    const channel = supabase
      .channel('client_services_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_services',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Real-time service update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setServices(prev => [payload.new as Service, ...prev]);
            toast.success('Novo serviço adicionado');
          } else if (payload.eventType === 'UPDATE') {
            setServices(prev => prev.map(service => 
              service.id === payload.new.id ? payload.new as Service : service
            ));
            toast.success('Informações de serviço atualizadas');
          } else if (payload.eventType === 'DELETE') {
            setServices(prev => prev.filter(service => service.id !== payload.old.id));
            toast.info('Serviço removido');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRenewService = async (serviceId: string) => {
    toast.info('Processando renovação...', { duration: 2000 });
    // In a real app, this would initiate the renewal workflow
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'active': 'bg-green-500',
      'suspended': 'bg-yellow-500',
      'pending': 'bg-blue-500',
      'cancelled': 'bg-red-500',
      'default': 'bg-gray-500'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.default}>
        {status}
      </Badge>
    );
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'hosting':
        return <Server className="text-blue-500" size={24} />;
      case 'email':
        return <Mail className="text-green-500" size={24} />;
      case 'domain':
        return <Globe className="text-purple-500" size={24} />;
      default:
        return <Server className="text-gray-500" size={24} />;
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    
    return `${value.toFixed(2)} ${units[unitIndex]}`;
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
        <h1 className="text-3xl font-bold">Meus Serviços</h1>
        <Button onClick={() => navigate("/")}>
          Contratar Novos Serviços
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Carregando serviços...</p>
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(service.service_type)}
                    <div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>
                        {service.description || `Serviço de ${service.service_type}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Data de Renovação:</span>
                      <span className="font-medium">
                        {format(new Date(service.renewal_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço Mensal:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(service.price_monthly)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço Anual:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(service.price_yearly)}
                      </span>
                    </div>
                  </div>
                  
                  {(service.disk_space || service.bandwidth || service.control_panel_url) && (
                    <div className="space-y-2">
                      {service.disk_space && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Espaço em Disco:</span>
                          <span className="font-medium">{formatBytes(service.disk_space)}</span>
                        </div>
                      )}
                      
                      {service.bandwidth && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Largura de Banda:</span>
                          <span className="font-medium">{formatBytes(service.bandwidth)}</span>
                        </div>
                      )}
                      
                      {service.control_panel_url && service.control_panel_username && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Usuário do Painel:</span>
                          <span className="font-medium">{service.control_panel_username}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleRenewService(service.id)}>
                  Renovar Serviço
                </Button>
                
                {service.control_panel_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(service.control_panel_url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink size={16} />
                    <span>Acessar Painel</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhum serviço encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui serviços contratados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => navigate("/")}>
              Contratar Serviços
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesPage;
