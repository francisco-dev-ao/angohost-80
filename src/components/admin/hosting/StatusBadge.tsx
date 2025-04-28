
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    case "suspended":
      return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default StatusBadge;
