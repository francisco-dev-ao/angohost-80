
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTickets } from "@/hooks/useAdminTickets";
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
import { Search, ChevronDown, MessageSquare, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
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

const AdminTickets = () => {
  const { tickets, isLoading, updateTicketStatus, assignTicket } = useAdminTickets();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800">Aberto</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Em andamento</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">Fechado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h2>
            <p className="text-muted-foreground">
              Gerenciar tickets de suporte dos clientes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tickets</CardTitle>
            <CardDescription>
              Total de {filteredTickets.length} tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tickets..."
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
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Aberto em</TableHead>
                      <TableHead>Atribuído a</TableHead>
                      <TableHead>Última atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center"
                        >
                          Nenhum ticket encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                              {ticket.subject}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>
                            {format(new Date(ticket.createdAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            {ticket.assignedTo || "Não atribuído"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {formatDistanceToNow(new Date(ticket.updatedAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </div>
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
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  Responder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'open')}>
                                  Marcar como Aberto
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'in-progress')}>
                                  Marcar como Em Andamento
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'closed')}>
                                  Marcar como Fechado
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => assignTicket(ticket.id, 'current-user-id')}>
                                  Atribuir a Mim
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

export default AdminTickets;
