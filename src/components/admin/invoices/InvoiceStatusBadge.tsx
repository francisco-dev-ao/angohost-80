
import React from "react";
import { Badge } from "@/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
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

export default InvoiceStatusBadge;
