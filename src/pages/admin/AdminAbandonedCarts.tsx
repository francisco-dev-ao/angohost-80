
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAbandonedCarts } from '@/hooks/useAbandonedCarts';

// Import our new components
import { CartHeader } from '@/components/admin/abandoned-carts/CartHeader';
import { CartStatistics } from '@/components/admin/abandoned-carts/CartStatistics';
import { CartListContent } from '@/components/admin/abandoned-carts/CartListContent';

const AdminAbandonedCarts = () => {
  const { 
    abandonedCarts, 
    isLoading, 
    timeRange, 
    setTimeRange,
    sendManualReminder,
    recoverAbandonedCart
  } = useAbandonedCarts();
  
  const [processingCart, setProcessingCart] = useState<string | null>(null);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleSendReminder = async (cartId: string) => {
    setProcessingCart(cartId);
    await sendManualReminder(cartId);
    setProcessingCart(null);
  };
  
  const handleMarkRecovered = async (cartId: string) => {
    setProcessingCart(cartId);
    await recoverAbandonedCart(cartId);
    setProcessingCart(null);
  };
  
  const getCartTotal = (cart: any) => {
    if (!cart.cart_items || !Array.isArray(cart.cart_items)) return 0;
    return cart.cart_items.reduce((total: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };
  
  const getTotalValue = () => {
    return abandonedCarts.reduce((total, cart) => total + getCartTotal(cart), 0);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <CartHeader 
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onRefresh={handleRefresh}
        />
        
        <CartStatistics 
          cartsCount={abandonedCarts.length}
          totalValue={getTotalValue()}
        />
        
        <CartListContent
          abandonedCarts={abandonedCarts}
          isLoading={isLoading}
          processingCart={processingCart}
          onSendReminder={handleSendReminder}
          onMarkRecovered={handleMarkRecovered}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAbandonedCarts;
