
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPrice } from "@/utils/formatters";
import OrderActions from "./OrderActions";

interface OrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  isOpen,
  onOpenChange,
  onActionComplete
}) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.orderNumber}</span>
            <div>
              <OrderActions order={order} onActionComplete={onActionComplete} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Informações do Pedido</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">ID:</span>
                  <span className="text-gray-600">{order.id}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Status:</span>
                  <span>{getStatusBadge(order.status)}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Cliente ID:</span>
                  <span className="text-gray-600">{order.userId}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Valor Total:</span>
                  <span className="text-gray-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Datas</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Criado em:</span>
                  <span className="text-gray-600">
                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                {order.updatedAt && (
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">Atualizado em:</span>
                    <span className="text-gray-600">
                      {format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Itens do Pedido</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Preço Unitário</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity || 1}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price || 0)}</TableCell>
                        <TableCell className="text-right">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhum item encontrado para este pedido
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                    <TableCell className="text-right font-bold">{formatPrice(order.totalAmount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
