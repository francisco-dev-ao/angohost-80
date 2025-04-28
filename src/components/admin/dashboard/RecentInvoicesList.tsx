
import { Invoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatters";

interface RecentInvoicesListProps {
  invoices: Invoice[];
}

const RecentInvoicesList = ({ invoices }: RecentInvoicesListProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento:{" "}
                    {format(new Date(invoice.due_date), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div>{formatPrice(invoice.amount)}</div>
                  <div>{getStatusBadge(invoice.status)}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/invoices?id=${invoice.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/invoices")}
            >
              Ver Todas as Faturas
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p>Nenhuma fatura recente encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentInvoicesList;
