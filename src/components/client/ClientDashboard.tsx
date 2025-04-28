
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRealtimeClientDashboard } from "@/hooks/useRealtimeClientDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe, Server, FileInvoice, TicketCheck, Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  linkTo, 
  linkText 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  linkTo: string; 
  linkText: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Clique para visualizar detalhes
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate(linkTo)}
        >
          {linkText}
        </Button>
      </CardContent>
    </Card>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const dashboardStats = useRealtimeClientDashboard();

  if (dashboardStats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'active': 'bg-green-500',
      'expired': 'bg-red-500',
      'pending': 'bg-yellow-500',
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
      <h1 className="text-3xl font-bold">Painel do Cliente</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <DashboardCard
          title="Domínios"
          value={dashboardStats.domains}
          icon={<Globe className="h-5 w-5 text-blue-500" />}
          linkTo="/client/domains"
          linkText="Ver Domínios"
        />
        <DashboardCard
          title="Serviços Ativos"
          value={dashboardStats.activeServices}
          icon={<Server className="h-5 w-5 text-green-500" />}
          linkTo="/client/services"
          linkText="Ver Serviços"
        />
        <DashboardCard
          title="Faturas Pendentes"
          value={dashboardStats.pendingInvoices}
          icon={<FileInvoice className="h-5 w-5 text-yellow-500" />}
          linkTo="/client/invoices"
          linkText="Ver Faturas"
        />
        <DashboardCard
          title="Tickets Abertos"
          value={dashboardStats.openTickets}
          icon={<TicketCheck className="h-5 w-5 text-purple-500" />}
          linkTo="/client/support"
          linkText="Ver Suporte"
        />
        <DashboardCard
          title="Notificações"
          value={dashboardStats.notifications}
          icon={<Bell className="h-5 w-5 text-red-500" />}
          linkTo="/client/notifications"
          linkText="Ver Notificações"
        />
      </div>

      {/* Recent Domains Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Domínios Recentes</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/client/domains")}>
            Ver Todos
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardStats.domains_list.length > 0 ? (
            dashboardStats.domains_list.map((domain) => (
              <Card key={domain.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{domain.domain_name}</CardTitle>
                    {getStatusBadge(domain.status)}
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground">
                    Expira em: {format(new Date(domain.expiry_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-6 text-center">
                <p>Você não possui domínios registrados.</p>
                <Button className="mt-2" onClick={() => navigate("/domains")}>
                  Registrar Domínio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Services Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Serviços Ativos</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/client/services")}>
            Ver Todos
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {dashboardStats.services.length > 0 ? (
            dashboardStats.services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <Badge className="bg-green-500">
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground mb-2">
                    {service.description || `Serviço de ${service.service_type}`}
                  </p>
                  <p className="text-muted-foreground">
                    Renovação em: {format(new Date(service.renewal_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="py-6 text-center">
                <p>Você não possui serviços ativos.</p>
                <Button className="mt-2" onClick={() => navigate("/")}>
                  Contratar Serviços
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
