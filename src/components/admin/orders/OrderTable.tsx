
import { Eye, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatters";
import OrderActions from "@/components/admin/orders/OrderActions";

interface OrderTableProps {
  orders: Order[];
  sortBy: "date" | "number" | "amount";
  sortDirection: "asc" | "desc";
  handleSort: (column: "date" | "number" | "amount") => void;
  handleViewOrder: (order: Order) => void;
}

const OrderTable = ({
  orders,
  sortBy,
  sortDirection,
  handleSort,
  handleViewOrder,
}: OrderTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort("number")}
              >
                Número do Pedido
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Valor
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Data
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status === "pending" && "Pendente"}
                    {order.status === "processing" && "Processando"}
                    {order.status === "completed" && "Concluído"}
                    {order.status === "canceled" && "Cancelado"}
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <OrderActions order={order} onActionComplete={() => {}} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
