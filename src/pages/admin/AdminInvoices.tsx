
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useInvoices, Invoice } from "@/hooks/useInvoices";
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
import { Search, ChevronDown, FileText, Eye, Printer, Download } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminInvoices = () => {
  const { invoices, isLoading } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;
      
      toast.success('Status da fatura atualizado com sucesso');
      // The real-time subscription in useInvoices will update the UI
    } catch (error: any) {
      toast.error('Erro ao atualizar status da fatura: ' + error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Faturas</h2>
            <p className="text-muted-foreground">
              Gerenciar faturas de clientes
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Exportar Relatório
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Faturas</CardTitle>
            <CardDescription>
              Total de {filteredInvoices.length} faturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fatura por número..."
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
                      <TableHead>Nº da Fatura</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Vencimento</TableHead>
                      <TableHead>Data de Pagamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center"
                        >
                          Nenhuma fatura encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              {invoice.invoice_number}
                            </div>
                          </TableCell>
                          <TableCell>
                            {invoice.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            {format(new Date(invoice.due_date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            {invoice.payment_date
                              ? format(new Date(invoice.payment_date), "dd/MM/yyyy", {
                                  locale: ptBR,
                                })
                              : "-"}
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
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Imprimir
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateInvoiceStatus(invoice.id, 'paid')}>
                                  Marcar como Paga
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateInvoiceStatus(invoice.id, 'pending')}>
                                  Marcar como Pendente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateInvoiceStatus(invoice.id, 'cancelled')}>
                                  Cancelar Fatura
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateInvoiceStatus(invoice.id, 'refunded')}>
                                  Marcar como Reembolsada
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

export default AdminInvoices;
