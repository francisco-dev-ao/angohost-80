
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
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
import { Search, ChevronDown, Server } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for hosting services
const hostingServices = [
  {
    id: "1",
    name: "cPanel Hosting Básico",
    username: "cliente1",
    domain: "example.com",
    plan: "Starter",
    status: "active",
    expiryDate: "2025-10-15",
    creationDate: "2023-10-15",
  },
  {
    id: "2",
    name: "cPanel Hosting Premium",
    username: "cliente2",
    domain: "mywebsite.com",
    plan: "Business",
    status: "active",
    expiryDate: "2026-02-28",
    creationDate: "2024-02-28",
  },
  {
    id: "3",
    name: "WordPress Optimized",
    username: "cliente3",
    domain: "myblog.com",
    plan: "Professional",
    status: "suspended",
    expiryDate: "2025-01-10",
    creationDate: "2023-01-10",
  },
  {
    id: "4",
    name: "VPS Server",
    username: "cliente4",
    domain: "ecommerce.net",
    plan: "VPS-1",
    status: "active",
    expiryDate: "2025-06-20",
    creationDate: "2023-06-20",
  },
  {
    id: "5",
    name: "Dedicated Server",
    username: "cliente5",
    domain: "enterprise.org",
    plan: "Dedicated-2",
    status: "pending",
    expiryDate: "2025-05-15",
    creationDate: "2024-05-15",
  },
];

const AdminHosting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredServices = hostingServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
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
                          colSpan={7}
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
                          <TableCell>{service.username}</TableCell>
                          <TableCell>{service.domain}</TableCell>
                          <TableCell>{service.plan}</TableCell>
                          <TableCell>{getStatusBadge(service.status)}</TableCell>
                          <TableCell>
                            {format(new Date(service.expiryDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Abrir menu</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {}}>
                                  Acessar cPanel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  {service.status === "active" ? "Suspender" : "Ativar"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
