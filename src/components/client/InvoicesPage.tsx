
import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import InvoiceViewDialog from '@/components/client/InvoiceViewDialog';
import { Invoice } from '@/hooks/useInvoices';

const InvoicesPage = () => {
  const { invoices, isLoading } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="p-8">Carregando faturas...</div>;
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800"
    };

    const statusLabels = {
      pending: "Pendente",
      paid: "Pago",
      cancelled: "Cancelado",
      refunded: "Reembolsado"
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.default}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const downloadInvoice = (invoice: Invoice) => {
    // URL for downloading would be implemented here
    // Currently mocked with an alert
    alert(`Download da fatura ${invoice.invoice_number} iniciado`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Faturas</h1>
      
      <Table>
        <TableCaption>Lista de todas as suas faturas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nº da Fatura</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => downloadInvoice(invoice)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhuma fatura encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedInvoice && (
        <InvoiceViewDialog
          invoice={selectedInvoice}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
