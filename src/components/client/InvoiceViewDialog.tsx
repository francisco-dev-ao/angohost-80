
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Invoice } from '@/hooks/useInvoices';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPrice } from '@/utils/formatters';
import { useInvoices } from '@/hooks/useInvoices';

interface InvoiceViewDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceViewDialog = ({ invoice, isOpen, onClose }: InvoiceViewDialogProps) => {
  const { downloadInvoice } = useInvoices();
  const companyDetails = {
    name: "AngoHost",
    address: "Rua Principal, Luanda, Angola",
    phone: "+244 923 456 789",
    email: "support@angohost.ao",
    vat: "123456789"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadInvoice(invoice.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fatura #{invoice.invoice_number}</DialogTitle>
          <DialogDescription>
            Emitida em {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="invoice-container p-4 border rounded-md">
          {/* Company and Client Information */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="font-bold mb-2">De:</h3>
              <p>{companyDetails.name}</p>
              <p>{companyDetails.address}</p>
              <p>{companyDetails.phone}</p>
              <p>{companyDetails.email}</p>
              <p>VAT: {companyDetails.vat}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Para:</h3>
              <p>{invoice.client_details?.name || "Cliente"}</p>
              <p>{invoice.client_details?.address || ""}</p>
              <p>{invoice.client_details?.phone || ""}</p>
              <p>{invoice.client_details?.email || ""}</p>
              <p>{invoice.client_details?.document ? `Doc: ${invoice.client_details.document}` : ""}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Fatura Nº:</span> {invoice.invoice_number}</p>
                <p>
                  <span className="font-semibold">Data de Emissão:</span> {" "}
                  {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Vencimento:</span> {" "}
                  {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {" "}
                  <span className={`
                    ${invoice.status === 'paid' ? 'text-green-600' : 
                      invoice.status === 'pending' ? 'text-yellow-600' : 
                      invoice.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}
                    font-medium
                  `}>
                    {invoice.status === 'paid' ? 'Pago' : 
                     invoice.status === 'pending' ? 'Pendente' : 
                     invoice.status === 'cancelled' ? 'Cancelado' : 
                     invoice.status === 'refunded' ? 'Reembolsado' : invoice.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="font-bold mb-4">Itens</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Descrição</th>
                    <th className="border p-2 text-right">Quantidade</th>
                    <th className="border p-2 text-right">Preço</th>
                    <th className="border p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && Array.isArray(invoice.items) ? (
                    invoice.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2 text-right">{item.quantity}</td>
                        <td className="border p-2 text-right">{formatPrice(item.price)}</td>
                        <td className="border p-2 text-right">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="border p-2 text-center">Nenhum item disponível</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Total:</span>
                <span>{formatPrice(invoice.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewDialog;
