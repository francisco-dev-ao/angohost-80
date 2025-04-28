
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import OrderHeader from '@/components/admin/orders/OrderHeader';
import OrderTable from '@/components/admin/orders/OrderTable';
import OrderLoader from '@/components/admin/orders/OrderLoader';
import OrderDetails from '@/components/admin/orders/OrderDetails';
import OrderForm from '@/components/admin/orders/OrderForm';

const AdminOrders = () => {
  const { orders, isLoading, createOrder } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  
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

  if (isLoading) {
    return (
      <AdminLayout>
        <OrderLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
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
        />
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
