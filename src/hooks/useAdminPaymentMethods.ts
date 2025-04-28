
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: string;
  card_last_four?: string;
  card_expiry?: string;
  card_brand?: string;
  billing_name?: string;
  billing_address?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  user_full_name?: string; // Join from profiles
  user_email?: string; // Join from profiles
}

export const useAdminPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      
      // Fetch payment methods with user details
      const { data, error, count } = await supabase
        .from('payment_methods')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `, { count: 'exact' });

      if (error) throw error;
      
      // Transform data to include user details in flat structure
      const formattedPaymentMethods: PaymentMethod[] = data.map((method: any) => ({
        ...method,
        user_full_name: method.profiles?.full_name || 'Usuário Desconhecido',
        user_email: method.profiles?.email || 'N/A'
      }));
      
      setPaymentMethods(formattedPaymentMethods);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error('Erro ao carregar métodos de pagamento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();

    // Set up real-time listener
    const channel = supabase
      .channel('admin-payment-methods')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_methods'
        },
        () => {
          fetchPaymentMethods();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const togglePaymentMethodActivity = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Método de pagamento ${isActive ? 'desativado' : 'ativado'} com sucesso`);
      fetchPaymentMethods();
    } catch (error: any) {
      toast.error('Erro ao alterar status do método de pagamento: ' + error.message);
    }
  };

  return { 
    paymentMethods, 
    isLoading, 
    totalCount, 
    fetchPaymentMethods, 
    togglePaymentMethodActivity 
  };
};
