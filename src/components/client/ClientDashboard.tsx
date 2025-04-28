
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const stats = useClientDashboard();
  
  if (stats.loading) {
    return <div className="py-8 text-center">Carregando dados do dashboard...</div>;
  }

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
              {stats.services.length > 0 ? (
                <>
                  {stats.services.map((service) => (
                    <div key={service.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Expira em: {format(new Date(service.renewal_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/client/services')}>
                          Gerenciar
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum serviço ativo encontrado
                </p>
              )}
              
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
              {stats.invoices.length > 0 ? (
                <>
                  {stats.invoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Fatura #{invoice.invoice_number || invoice.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                          <p className="text-sm font-medium text-red-500">
                            Pendente: {new Intl.NumberFormat('pt-AO', {
                              style: 'currency',
                              currency: 'AOA'
                            }).format(invoice.amount)}
                          </p>
                        </div>
                        <Button variant="default" size="sm" onClick={() => navigate('/client/invoices')}>
                          Pagar Agora
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma fatura pendente
                </p>
              )}
              
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
            {stats.domains_list.length > 0 ? (
              <>
                {stats.domains_list.map((domain) => (
                  <div key={domain.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{domain.domain_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Expira em: {format(new Date(domain.expiry_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('/client/domains')}>
                        Gerenciar DNS
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum domínio registrado
              </p>
            )}
            
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
