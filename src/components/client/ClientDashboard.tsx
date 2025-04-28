
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Globe,
  Server,
  FileText,
  LifeBuoy,
  Bell,
  Plus 
} from "lucide-react";

const ClientDashboard = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  // Mock data - would be fetched from API in production
  const stats = {
    domains: 3,
    activeServices: 2,
    pendingInvoices: 1,
    openTickets: 0,
    notifications: 2
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo ao Painel</h1>
        <Button onClick={() => navigate("/domains")} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Serviço</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="text-primary" size={20} />
              Domínios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.domains}</div>
            <p className="text-sm text-muted-foreground">Domínios ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="text-primary" size={20} />
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeServices}</div>
            <p className="text-sm text-muted-foreground">Serviços ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              Faturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-sm text-muted-foreground">Faturas pendentes</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <LifeBuoy className="text-primary" size={20} />
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openTickets}</div>
            <p className="text-sm text-muted-foreground">Tickets abertos</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="text-primary" size={20} />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.notifications}</div>
            <p className="text-sm text-muted-foreground">Novas notificações</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serviços Ativos</CardTitle>
            <CardDescription>Seus serviços ativos e status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Plano cPanel Start</p>
                    <p className="text-sm text-muted-foreground">Expira em: 25/12/2023</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/client/services')}>
                    Gerenciar
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Email Profissional</p>
                    <p className="text-sm text-muted-foreground">Expira em: 15/01/2024</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/client/services')}>
                    Gerenciar
                  </Button>
                </div>
              </div>
              
              <Button variant="link" className="w-full" onClick={() => navigate('/client/services')}>
                Ver todos os serviços
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturas Pendentes</CardTitle>
            <CardDescription>Suas faturas que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Fatura #1234</p>
                    <p className="text-sm text-muted-foreground">Vencimento: 10/11/2023</p>
                    <p className="text-sm font-medium text-red-500">Pendente: 50,00 €</p>
                  </div>
                  <Button variant="default" size="sm" onClick={() => navigate('/client/invoices')}>
                    Pagar Agora
                  </Button>
                </div>
              </div>
              
              <Button variant="link" className="w-full" onClick={() => navigate('/client/invoices')}>
                Ver todas as faturas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Domínios Registrados</CardTitle>
          <CardDescription>Status dos seus domínios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">example.com</p>
                  <p className="text-sm text-muted-foreground">Expira em: 15/08/2024</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/client/domains')}>
                  Gerenciar DNS
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">mysite.com</p>
                  <p className="text-sm text-muted-foreground">Expira em: 22/03/2024</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/client/domains')}>
                  Gerenciar DNS
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">businessdomain.com</p>
                  <p className="text-sm text-muted-foreground">Expira em: 05/02/2024</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/client/domains')}>
                  Gerenciar DNS
                </Button>
              </div>
            </div>
            
            <Button variant="link" className="w-full" onClick={() => navigate('/client/domains')}>
              Ver todos os domínios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
