
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderTableProps {
  orders: any[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: string) => void;
  handleViewOrder: (order: any) => void;
  actionMenu?: (order: any) => React.ReactNode;
}

const OrderTable = ({
  orders,
  sortBy,
  sortDirection,
  handleSort,
  handleViewOrder,
  actionMenu,
}: OrderTableProps) => {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('order_number')}
            >
              <div className="flex items-center">
                Nº do Pedido
                {getSortIcon('order_number')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center">
                Data
                {getSortIcon('created_at')}
              </div>
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('total_amount')}
            >
              <div className="flex items-center justify-end">
                Total
                {getSortIcon('total_amount')}
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum pedido encontrado.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {order.client_details?.name || 'Cliente'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  {getPaymentStatusBadge(order.payment_status)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.total_amount)}
                </TableCell>
                <TableCell className="text-right">
                  {actionMenu ? (
                    actionMenu(order)
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                  )}
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
