
import React from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';
import { FileText, Download } from 'lucide-react';
import { InvoiceViewDialog } from './InvoiceViewDialog';
import { useState } from 'react';

const InvoicesPage = () => {
  const { invoices, isLoading, downloadInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openInvoiceDialog = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Pago
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Pendente
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Vencida
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status || 'Desconhecido'}
          </span>
        );
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Carregando faturas...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Faturas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número da Fatura</TableHead>
                  <TableHead>Data de Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2" onClick={() => openInvoiceDialog(invoice)} style={{ cursor: 'pointer' }}>
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{invoice.invoice_number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(invoice.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => downloadInvoice(invoice.id)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span>PDF</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Você não possui faturas.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoiceViewDialog
          invoice={selectedInvoice}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
