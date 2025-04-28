
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Eye, Search, ArrowUpDown, PlusCircle } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import OrderDetails from '@/components/admin/orders/OrderDetails';
import OrderActions from '@/components/admin/orders/OrderActions';
import OrderForm from '@/components/admin/orders/OrderForm';

const AdminOrders = () => {
  const { orders, isLoading, fetchOrderById, createOrder } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const handleSort = (column: 'date' | 'number' | 'amount') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortBy === 'number') {
      return sortDirection === 'asc'
        ? a.orderNumber.localeCompare(b.orderNumber)
        : b.orderNumber.localeCompare(a.orderNumber);
    }
    
    // amount
    return sortDirection === 'asc'
      ? a.totalAmount - b.totalAmount
      : b.totalAmount - a.totalAmount;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Pedidos</h1>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar pedidos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsOrderFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('number')}
                  >
                    Número do Pedido
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Valor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status === 'pending' && 'Pendente'}
                        {order.status === 'processing' && 'Processando'}
                        {order.status === 'completed' && 'Concluído'}
                        {order.status === 'canceled' && 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
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
                        <OrderActions 
                          order={order} 
                          onActionComplete={() => {}} 
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <OrderDetails
        order={selectedOrder}
        isOpen={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
        onActionComplete={() => {}}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onOpenChange={setIsOrderFormOpen}
        onSuccess={() => {}}
        onOrderCreate={createOrder}
      />
    </AdminLayout>
  );
};

export default AdminOrders;
