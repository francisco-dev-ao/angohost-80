
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow, format, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, Server } from 'lucide-react';
import { useClientServices } from '@/hooks/useClientServices';
import { formatPrice } from '@/utils/formatters';

const ServicesPage = () => {
  const { services, loading, renewService, toggleAutoRenew } = useClientServices();
  const [detailsService, setDetailsService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (service: any) => {
    setDetailsService(service);
    setDialogOpen(true);
  };

  const getRemainingDays = (renewalDate: string) => {
    const renewalDay = new Date(renewalDate);
    const today = new Date();
    const diffTime = renewalDay.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isExpiringSoon = (renewalDate: string) => {
    return getRemainingDays(renewalDate) <= 30;
  };

  const isPaymentDue = (renewalDate: string) => {
    // Check if renewal is due within 3 days
    const renewalDay = new Date(renewalDate);
    const dueDate = addDays(new Date(), 3);
    return isBefore(renewalDay, dueDate);
  };

  if (loading) {
    return <div className="py-8 text-center">Carregando serviços...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meus Serviços</h1>

      {services.length > 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços de Hospedagem</CardTitle>
              <CardDescription>
                Lista de todos os seus serviços contratados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Renovação</TableHead>
                    <TableHead>Renovação Automática</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        {service.service_type === 'hosting' && 'Hospedagem'}
                        {service.service_type === 'email' && 'Email'}
                        {service.service_type === 'vps' && 'Servidor VPS'}
                        {service.service_type === 'dedicated' && 'Servidor Dedicado'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(service.status)}>
                          {service.status === 'active' && 'Ativo'}
                          {service.status === 'suspended' && 'Suspenso'}
                          {service.status === 'cancelled' && 'Cancelado'}
                          {service.status === 'pending' && 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {format(new Date(service.renewal_date), 'dd/MM/yyyy')}
                        </div>
                        <div className={`text-xs ${isExpiringSoon(service.renewal_date) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                          {isExpiringSoon(service.renewal_date)
                            ? `Expira em ${getRemainingDays(service.renewal_date)} dias`
                            : `Expira em ${formatDistanceToNow(new Date(service.renewal_date), { locale: ptBR })}`
                          }
                        </div>
                        {isPaymentDue(service.renewal_date) && (
                          <div className="text-xs text-red-500 font-medium mt-1">
                            Pagamento em até 3 dias!
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={service.auto_renew}
                          onCheckedChange={() => toggleAutoRenew(service.id, service.auto_renew)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(service)}
                          >
                            Detalhes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => renewService(service.id)}
                            disabled={service.status !== 'active'}
                          >
                            Renovar
                          </Button>
                          {service.control_panel_url && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <a 
                                href={service.control_panel_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" /> Painel
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-lg">
              {detailsService && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Server className="mr-2 h-5 w-5" />
                      {detailsService.name}
                    </DialogTitle>
                    <DialogDescription>
                      Detalhes do serviço
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Tipo de Serviço</p>
                        <p>
                          {detailsService.service_type === 'hosting' && 'Hospedagem'}
                          {detailsService.service_type === 'email' && 'Email'}
                          {detailsService.service_type === 'vps' && 'Servidor VPS'}
                          {detailsService.service_type === 'dedicated' && 'Servidor Dedicado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Status</p>
                        <Badge variant="outline" className={getStatusColor(detailsService.status)}>
                          {detailsService.status === 'active' && 'Ativo'}
                          {detailsService.status === 'suspended' && 'Suspenso'}
                          {detailsService.status === 'cancelled' && 'Cancelado'}
                          {detailsService.status === 'pending' && 'Pendente'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Data de Renovação</p>
                        <p>{format(new Date(detailsService.renewal_date), 'dd/MM/yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Última Renovação</p>
                        <p>
                          {detailsService.last_renewed_at
                            ? format(new Date(detailsService.last_renewed_at), 'dd/MM/yyyy')
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Preço Mensal</p>
                        <p>{formatPrice(detailsService.price_monthly)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Preço Anual</p>
                        <p>{formatPrice(detailsService.price_yearly)}</p>
                      </div>
                    </div>

                    {(detailsService.disk_space || detailsService.bandwidth) && (
                      <div className="grid grid-cols-2 gap-4">
                        {detailsService.disk_space && (
                          <div>
                            <p className="text-sm font-medium mb-1">Espaço em Disco</p>
                            <p>
                              {detailsService.disk_space < 1024
                                ? `${detailsService.disk_space} MB`
                                : `${detailsService.disk_space / 1024} GB`
                              }
                            </p>
                          </div>
                        )}
                        {detailsService.bandwidth && (
                          <div>
                            <p className="text-sm font-medium mb-1">Largura de Banda</p>
                            <p>
                              {detailsService.bandwidth < 1024
                                ? `${detailsService.bandwidth} MB`
                                : `${detailsService.bandwidth / 1024} GB`
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {detailsService.control_panel_url && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Painel de Controle</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">URL</p>
                            <a 
                              href={detailsService.control_panel_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              Acessar <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                          {detailsService.control_panel_username && (
                            <div>
                              <p className="text-sm text-muted-foreground">Usuário</p>
                              <p>{detailsService.control_panel_username}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {detailsService.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Descrição</p>
                        <p className="text-sm">{detailsService.description}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum serviço encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui serviços contratados.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/products/cpanel">Contratar serviço de hospedagem</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ServicesPage;
