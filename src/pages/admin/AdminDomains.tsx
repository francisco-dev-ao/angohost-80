
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminDomains } from "@/hooks/useAdminDomains";
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
import { Search, Globe, ChevronDown } from "lucide-react";
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

const AdminDomains = () => {
  const { domains, isLoading, updateDomainStatus } = useAdminDomains();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDomains = domains.filter((domain) =>
    domain.domainName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "transferring":
        return <Badge className="bg-blue-100 text-blue-800">Em transferência</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Domínios</h2>
            <p className="text-muted-foreground">
              Gerenciar registros de domínios
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de domínios</CardTitle>
            <CardDescription>
              Total de {filteredDomains.length} domínios registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar domínios..."
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
                      <TableHead>Domínio</TableHead>
                      <TableHead>Data de Registro</TableHead>
                      <TableHead>Data de Expiração</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>WHOIS Privacy</TableHead>
                      <TableHead>Bloqueado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDomains.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center"
                        >
                          Nenhum domínio encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDomains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                              {domain.domainName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(domain.registrationDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(domain.expiryDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(domain.status)}</TableCell>
                          <TableCell>
                            {domain.whoisPrivacy ? "Sim" : "Não"}
                          </TableCell>
                          <TableCell>
                            {domain.isLocked ? "Sim" : "Não"}
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
                                  Visualizar detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateDomainStatus(domain.id, domain.status === 'active' ? 'expired' : 'active')}>
                                  {domain.status === 'active' ? 'Marcar como expirado' : 'Ativar domínio'}
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

export default AdminDomains;
