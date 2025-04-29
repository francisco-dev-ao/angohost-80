
import { supabase } from '@/integrations/supabase/client';

export const useAdminRealtimeListeners = () => {
  const setupRealtimeListeners = (onDataChange: () => void) => {
    const ordersChannel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          onDataChange();
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('admin-dashboard-invoices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          onDataChange();
        }
      )
      .subscribe();

    const paymentMethodsChannel = supabase
      .channel('admin-dashboard-payment-methods')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_methods'
        },
        () => {
          onDataChange();
        }
      )
      .subscribe();
      
    return { ordersChannel, invoicesChannel, paymentMethodsChannel };
  };

  return { setupRealtimeListeners };
};
