
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Server } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ServiceActions from "@/components/admin/ServiceActions";
import StatusBadge from "./StatusBadge";
import { HostingService } from "@/hooks/useAdminHosting";

interface HostingServicesTableProps {
  services: HostingService[];
}

const HostingServicesTable = ({ services }: HostingServicesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Domínio</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expiração</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum serviço de hospedagem encontrado.
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                    {service.name}
                  </div>
                </TableCell>
                <TableCell>{service.userEmail || 'N/A'}</TableCell>
                <TableCell>{service.username}</TableCell>
                <TableCell>{service.domain || 'N/A'}</TableCell>
                <TableCell>{service.plan}</TableCell>
                <TableCell>
                  <StatusBadge status={service.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(service.expiryDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <ServiceActions 
                    serviceId={service.id} 
                    status={service.status}
                    controlPanelUrl={service.controlPanelUrl}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HostingServicesTable;
