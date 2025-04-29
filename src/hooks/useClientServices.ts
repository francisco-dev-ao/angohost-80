
import { useState } from 'react';
import { toast } from 'sonner';

// Definição do tipo para serviços
export interface ClientService {
  id: string;
  name: string;
  description: string;
  service_type: string;
  status: string;
  price_yearly: number;
  renewal_date: string;
  auto_renew: boolean;
  control_panel_url?: string;
}

export const useClientServices = () => {
  const [services, setServices] = useState<ClientService[]>([
    {
      id: 'hosting-1',
      name: 'Plano Empresarial',
      description: 'Hospedagem cPanel',
      service_type: 'hosting',
      status: 'active',
      price_yearly: 99900,
      renewal_date: '2026-04-29',
      auto_renew: true,
      control_panel_url: 'https://cpanel.angohost.ao'
    },
    {
      id: 'email-1',
      name: 'Business Email',
      description: 'Email profissional',
      service_type: 'email',
      status: 'active',
      price_yearly: 49900,
      renewal_date: '2025-08-15',
      auto_renew: true,
      control_panel_url: 'https://mail.angohost.ao'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  
  const renewService = (serviceId: string) => {
    // Simulação de renovação de serviço
    toast.success('Pedido de renovação enviado com sucesso!');
  };
  
  const toggleAutoRenew = (serviceId: string, currentValue: boolean) => {
    // Atualiza o estado local
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, auto_renew: !currentValue } 
          : service
      )
    );
    
    toast.success(currentValue 
      ? 'Renovação automática desativada' 
      : 'Renovação automática ativada'
    );
  };
  
  return {
    services,
    loading,
    renewService,
    toggleAutoRenew
  };
};
