
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export const useOrderSubmission = (contactProfile: string | null, profiles: any[], paymentMethod: string | null, formData: any) => {
  const [isSavingCart, setIsSavingCart] = useState(false);
  const { saveCartAsOrder, isSaving } = useSaveOrder();
  const { user } = useSupabaseAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para finalizar a compra');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    
    try {
      setIsSavingCart(true);
      
      const orderData = {
        paymentMethodId: paymentMethod,
        contactProfileId: contactProfile,
        clientDetails: contactProfile 
          ? profiles.find(p => p.id === contactProfile) 
          : { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address }
      };
      
      const order = await saveCartAsOrder(orderData);
      if (order) {
        toast.success('Pedido criado com sucesso! Aguardando pagamento.');
        clearCart();
        navigate(`/client/orders?order=${order.id}`);
      }
    } catch (error: any) {
      toast.error('Erro ao processar o pedido: ' + error.message);
    } finally {
      setIsSavingCart(false);
    }
  };
  
  return {
    handleSubmit,
    isSavingCart,
    isSaving: isSaving || isSavingCart
  };
};
