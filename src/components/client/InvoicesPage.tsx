
import React from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const InvoicesPage = () => {
  const { invoices, isLoading } = useInvoices();

  if (isLoading) {
    return <div className="p-8">Carregando faturas...</div>;
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-500",
      paid: "bg-green-500",
      cancelled: "bg-red-500",
      default: "bg-gray-500"
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.default}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Minhas Faturas</h1>
      
      <Table>
        <TableCaption>Lista de todas as suas faturas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nº da Fatura</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>
                {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA'
                }).format(invoice.amount)}
              </TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
            </TableRow>
          ))}
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhuma fatura encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesPage;
