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
import { ExternalLink, Server, Mail, Globe } from "lucide-react";
import { Service } from "@/types/client";

const ServicesPage = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('client_services')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setServices(data as Service[] || []);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast.error('Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [user]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Serviços</h1>
        <Button onClick={() => navigate("/")}>
          Contratar Novos Serviços
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando serviços...</div>
      ) : services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id}>
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
                <Button variant="outline" size="sm">
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
