
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import OrderHeader from '@/components/admin/orders/OrderHeader';
import OrderTable from '@/components/admin/orders/OrderTable';
import OrderLoader from '@/components/admin/orders/OrderLoader';
import OrderDetails from '@/components/admin/orders/OrderDetails';
import OrderForm from '@/components/admin/orders/OrderForm';
import { motion } from 'framer-motion';
import AdminActionMenu from '@/components/admin/AdminActionMenu';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

const AdminOrders = () => {
  const { orders, isLoading, createOrder, fetchOrders } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { user } = useSupabaseAuth();
  
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleSort,
    sortedOrders
  } = useOrderManagement(orders);

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  const deleteOrder = async (id: string) => {
    try {
      // Only support@angohost.ao can delete orders
      if (user?.email !== 'support@angohost.ao') {
        toast.error('Apenas super administradores podem excluir pedidos');
        return;
      }
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Pedido excluído com sucesso');
      fetchOrders();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error(`Erro ao excluir pedido: ${error.message}`);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <OrderLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <OrderHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setIsOrderFormOpen={setIsOrderFormOpen} 
        />
        
        <OrderTable 
          orders={sortedOrders} 
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleViewOrder={handleViewOrder}
          actionMenu={
            (order) => (
              <AdminActionMenu
                id={order.id}
                name={`Pedido #${order.order_number}`}
                type="order"
                onDelete={deleteOrder}
                onView={() => handleViewOrder(order)}
              />
            )
          }
        />
      </motion.div>
      
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
