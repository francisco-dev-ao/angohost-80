
import React from 'react';
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
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ShoppingBag, RefreshCcw, Filter, Download, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/formatters';

const OrdersPage = () => {
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending_invoice': return 'Fatura Gerada';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending_invoice': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-7 w-7" />
          Meus Pedidos
        </h1>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4" />
          Atualizar
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl">Histórico de Pedidos</CardTitle>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
              <Filter className="h-3 w-3" /> Filtrar
            </Button>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número do Pedido</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'cancelled' || order.status === 'canceled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'completed' ? 'Concluído' :
                             order.status === 'pending' ? 'Pendente' :
                             order.status === 'processing' ? 'Processando' :
                             order.status === 'cancelled' || order.status === 'canceled' ? 'Cancelado' :
                             order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            getPaymentStatusClass(order.payment_status)
                          }`}>
                            {getPaymentStatusLabel(order.payment_status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">Nenhum pedido encontrado</p>
                  <p className="text-muted-foreground">Seus pedidos aparecerão aqui quando você fizer compras em nossa loja.</p>
                </div>
                <Button onClick={() => window.location.href = '/domains'} className="mt-4">
                  Explorar produtos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrdersPage;
