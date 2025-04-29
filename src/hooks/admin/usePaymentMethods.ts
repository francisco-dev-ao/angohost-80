
import { supabase } from '@/integrations/supabase/client';

export const usePaymentMethods = () => {
  const fetchPaymentMethodCount = async (): Promise<number> => {
    try {
      const { count: paymentMethodCount, error: paymentMethodError } = await supabase
        .from('payment_methods')
        .select('*', { count: 'exact', head: true });
      
      if (paymentMethodError) throw paymentMethodError;
      
      return paymentMethodCount || 0;
    } catch (error) {
      console.error('Error fetching payment methods count:', error);
      return 0;
    }
  };

  return { fetchPaymentMethodCount };
};
