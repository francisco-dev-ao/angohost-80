
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';
import { Button } from '../ui/button';
import { Download, Printer } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';

interface InvoiceViewDialogProps {
  invoice: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewDialog = ({ invoice, isOpen, onOpenChange }: InvoiceViewDialogProps) => {
  const { downloadInvoice } = useInvoices();

  if (!invoice) return null;

  const handleDownload = () => {
    downloadInvoice(invoice.id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Fatura #{invoice.invoice_number}</DialogTitle>
          <DialogDescription>
            Detalhes da fatura emitida em {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Detalhes da Fatura</p>
              <p className="text-sm text-muted-foreground">Número: {invoice.invoice_number}</p>
              <p className="text-sm text-muted-foreground">Emitida em: {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
              <p className="text-sm text-muted-foreground">Vencimento: {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatPrice(invoice.amount)}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-1 mt-1 text-xs font-medium
                ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
              `}>
                {invoice.status === 'paid' ? 'Pago' :
                 invoice.status === 'pending' ? 'Pendente' :
                 invoice.status === 'overdue' ? 'Vencido' : 
                 invoice.status === 'cancelled' || invoice.status === 'canceled' ? 'Cancelado' : 
                 invoice.status}
              </span>
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-3">
            <p className="font-medium">Itens</p>
            {invoice.items && Array.isArray(invoice.items) ? (
              <div className="space-y-2">
                {invoice.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name || 'Item'}</span>
                    <span>{formatPrice(item.price || 0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum item detalhado disponível</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewDialog;
