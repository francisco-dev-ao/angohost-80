
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminHosting } from "@/hooks/useAdminHosting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Server } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ServiceActions from "@/components/admin/ServiceActions";

const AdminHosting = () => {
  const { services, isLoading } = useAdminHosting();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.domain && service.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      service.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.userEmail && service.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hospedagem</h2>
            <p className="text-muted-foreground">
              Gerenciar serviços de hospedagem
            </p>
          </div>
          <Button onClick={() => window.location.href = "/admin/hosting/create"}>
            Criar Novo Serviço
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Serviços de Hospedagem</CardTitle>
            <CardDescription>
              Total de {filteredServices.length} serviços de hospedagem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviços de hospedagem..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
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
                    {filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-24 text-center"
                        >
                          Nenhum serviço de hospedagem encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServices.map((service) => (
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
                          <TableCell>{getStatusBadge(service.status)}</TableCell>
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHosting;
