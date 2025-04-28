
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPaymentMethods } from "@/hooks/useAdminPaymentMethods";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Search, 
  EyeOff, 
  Eye, 
  ChevronDown,
  User,
  Mail,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPaymentMethods = () => {
  const { paymentMethods, isLoading, togglePaymentMethodActivity } = useAdminPaymentMethods();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      method.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.card_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.payment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (method.card_last_four && method.card_last_four.includes(searchTerm))
  );

  const getPaymentTypeDisplay = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      case 'bank_transfer':
        return 'Transferência Bancária';
      case 'mobile_payment':
        return 'Pagamento Móvel';
      default:
        return type;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Métodos de Pagamento</h2>
            <p className="text-muted-foreground">
              Gerenciar métodos de pagamento dos clientes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Métodos de Pagamento</CardTitle>
            <CardDescription>
              Total de {filteredPaymentMethods.length} métodos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, tipo ou cartão..."
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Registro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaymentMethods.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center"
                        >
                          Nenhum método de pagamento encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPaymentMethods.map((method) => (
                        <TableRow key={method.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{method.user_full_name}</span>
                              </div>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Mail className="mr-2 h-3 w-3" />
                                {method.user_email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                              {getPaymentTypeDisplay(method.payment_type)}
                              {method.is_default && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">Padrão</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {method.card_brand && (
                              <div>
                                <span className="font-medium">{method.card_brand}</span>
                                {method.card_last_four && (
                                  <span> •••• {method.card_last_four}</span>
                                )}
                                {method.card_expiry && (
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Expira em: {method.card_expiry}
                                  </div>
                                )}
                              </div>
                            )}
                            {(!method.card_brand && method.billing_name) && (
                              <span>{method.billing_name}</span>
                            )}
                            {(!method.card_brand && !method.billing_name) && (
                              <span className="text-muted-foreground">Sem detalhes disponíveis</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                method.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {method.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(method.created_at), "dd/MM/yyyy", {
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
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => togglePaymentMethodActivity(method.id, method.is_active)}>
                                  {method.is_active ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Desativar Método
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ativar Método
                                    </>
                                  )}
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

export default AdminPaymentMethods;
