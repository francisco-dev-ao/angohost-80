
import React from 'react';
import { useClientServices } from '@/hooks/useClientServices';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';
import { ServerIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const ServicesPage = () => {
  const { services, loading, renewService, toggleAutoRenew } = useClientServices();

  if (loading) {
    return <div className="py-8 text-center">Carregando serviços...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Ativo
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Suspenso
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status || 'Desconhecido'}
          </span>
        );
    }
  };

  const isRenewalSoon = (renewalDate: string) => {
    const now = new Date();
    const renewal = new Date(renewalDate);
    const differenceInDays = Math.ceil((renewal.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return differenceInDays <= 30;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Serviços</h1>
      </div>

      {services.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nenhum serviço encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui serviços contratados.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>Adquirir um serviço</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Serviços Contratados</CardTitle>
            <CardDescription>
              Gerencie seus serviços de hospedagem, e-mail e outros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista de serviços contratados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renovação</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Auto Renovar</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <ServerIcon className="h-4 w-4 text-primary" />
                        <div>
                          <p>{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.description || service.service_type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell>
                      <div>
                        {format(new Date(service.renewal_date), 'dd/MM/yyyy', { locale: ptBR })}
                        {isRenewalSoon(service.renewal_date) && (
                          <p className="text-xs text-orange-600 font-medium">Renovação em breve</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(service.price_yearly)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={service.auto_renew ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleAutoRenew(service.id, !!service.auto_renew)}
                        >
                          {service.auto_renew ? "Ativado" : "Desativado"}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {service.control_panel_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(service.control_panel_url, '_blank')}>
                          Painel
                        </Button>
                      )}
                      <Button size="sm" onClick={() => renewService(service.id)}>
                        Renovar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesPage;
