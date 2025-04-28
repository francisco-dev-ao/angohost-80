
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from '@/contexts/CartContext';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { toast } from 'sonner';
import { Check, CreditCard } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutFormProps {
  onComplete?: (orderId: string) => void;
}

const CheckoutForm = ({ onComplete }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const { saveCartAsOrder, isSaving } = useSaveOrder();
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
      
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
        
      if (error) throw error;
      
      setPaymentMethods(data || []);
      
      // Auto-select default payment method if exists
      const defaultMethod = data?.find(m => m.is_default);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/register');
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    
    try {
      const order = await saveCartAsOrder(selectedPaymentMethod);
      if (order) {
        onComplete?.(order.id);
        
        // Save customer information to profile if needed
        await supabase
          .from('profiles')
          .update({
            full_name: formData.name,
            phone: formData.phone,
            address: formData.address
          })
          .eq('id', user.id);
          
        toast.success('Pedido criado com sucesso! Aguardando pagamento.');
        navigate(`/client/orders?order=${order.id}`);
      }
    } catch (error: any) {
      toast.error('Erro ao processar o pedido: ' + error.message);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrinho vazio</CardTitle>
          <CardDescription>Não há itens para finalizar a compra</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/domains')}>Voltar para loja</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>Informe seus dados para faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Método de pagamento</CardTitle>
            <CardDescription>Selecione um método de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Carregando métodos de pagamento...</div>
            ) : paymentMethods.length > 0 ? (
              <RadioGroup 
                value={selectedPaymentMethod || undefined}
                onValueChange={setSelectedPaymentMethod}
              >
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`flex items-center justify-between border rounded-md p-4 ${
                        selectedPaymentMethod === method.id ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                        <Label htmlFor={`payment-${method.id}`} className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>
                            {method.card_brand || 'Cartão'} •••• {method.card_last_four}
                            {method.is_default && (
                              <span className="ml-2 text-sm text-muted-foreground">(Padrão)</span>
                            )}
                          </span>
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expira em {method.card_expiry}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="text-center py-4 space-y-4">
                <p>Você não possui métodos de pagamento cadastrados</p>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/client/payment-methods')}
                >
                  Adicionar método de pagamento
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => navigate('/cart')}>
              Voltar para o carrinho
            </Button>
            <Button type="submit" disabled={isSaving || paymentMethods.length === 0}>
              {isSaving ? 'Processando...' : 'Finalizar compra'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default CheckoutForm;
