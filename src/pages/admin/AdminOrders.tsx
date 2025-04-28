
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminOrders } from "@/hooks/useAdminOrders";
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
import { Search, ChevronDown, FileText } from "lucide-react";
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

const AdminOrders = () => {
  const { orders, isLoading, updateOrderStatus } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
            <p className="text-muted-foreground">
              Gerenciar pedidos de clientes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              Total de {filteredOrders.length} pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedidos por número..."
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
                      <TableHead>Nº do Pedido</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Data do Pedido</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center"
                        >
                          Nenhum pedido encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              {order.order_number}
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.total_amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.items.length} itens</TableCell>
                          <TableCell>
                            {format(new Date(order.created_at), "dd/MM/yyyy", {
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
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'completed')}>
                                  Marcar como Concluído
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                                  Marcar como Processando
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                                  Cancelar Pedido
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

export default AdminOrders;
