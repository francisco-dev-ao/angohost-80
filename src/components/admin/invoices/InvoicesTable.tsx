
import React from "react";
import { Invoice } from "@/hooks/useInvoices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPrice } from "@/utils/formatters";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoicesTableProps {
  invoices: Invoice[];
  onDeleteInvoice: (id: string) => Promise<void>;
  onViewInvoice: (id: string) => void;
}

const InvoicesTable = ({ invoices, onDeleteInvoice, onViewInvoice }: InvoicesTableProps) => {
  return (
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
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center"
              >
                Nenhuma fatura encontrada.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {invoice.invoice_number}
                  </div>
                </TableCell>
                <TableCell>
                  {formatPrice(invoice.amount)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
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
                  <AdminActionMenu 
                    id={invoice.id}
                    name={invoice.invoice_number}
                    type="invoice"
                    onDelete={onDeleteInvoice}
                    onView={() => onViewInvoice(invoice.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
