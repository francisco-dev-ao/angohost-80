import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash } from "lucide-react";
import { PaymentMethod } from "@/types/client";

const PaymentMethodsPage = () => {
  const { user } = useSupabaseAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    billingAddress: "",
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('is_default', { ascending: false });
          
        if (error) throw error;
        
        setPaymentMethods(data as PaymentMethod[] || []);
      } catch (error: any) {
        console.error('Error fetching payment methods:', error);
        toast.error('Erro ao carregar métodos de pagamento');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [user]);

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
        
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        is_default: method.id === id
      })));
      
      toast.success('Método de pagamento padrão atualizado');
    } catch (error: any) {
      console.error('Error updating default payment method:', error);
      toast.error('Erro ao definir método de pagamento padrão');
    }
  };

  const handleRemove = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false })
        .eq('id', id);
        
      if (error) throw error;
      
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      
      toast.success('Método de pagamento removido');
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      toast.error('Erro ao remover método de pagamento');
    }
  };

  const handleSubmitNewPaymentMethod = async () => {
    if (!user) return;
    
    try {
      const lastFour = newPaymentMethod.cardNumber.slice(-4);
      const brand = getCardBrand(newPaymentMethod.cardNumber);
      
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          payment_type: 'credit_card',
          card_brand: brand,
          card_last_four: lastFour,
          card_expiry: newPaymentMethod.cardExpiry,
          billing_name: newPaymentMethod.cardName,
          billing_address: newPaymentMethod.billingAddress,
          is_default: paymentMethods.length === 0,
          is_active: true,
        });
        
      if (error) throw error;
      
      const { data } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false });
        
      setPaymentMethods(data as PaymentMethod[] || []);
      
      setNewPaymentMethod({
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: "",
        billingAddress: "",
      });
      setDialogOpen(false);
      
      toast.success('Método de pagamento adicionado');
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast.error('Erro ao adicionar método de pagamento');
    }
  };

  const getCardBrand = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = parseInt(cardNumber.substring(0, 2), 10);
    
    if (firstDigit === '4') return 'Visa';
    if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'MasterCard';
    if (firstTwoDigits === 34 || firstTwoDigits === 37) return 'American Express';
    if (firstTwoDigits === 65 || firstTwoDigits === 60) return 'Discover';
    
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Métodos de Pagamento</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Adicionar Novo</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
              <DialogDescription>
                Preencha os dados do seu cartão para adicionar um novo método de pagamento.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  value={newPaymentMethod.cardNumber}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input 
                  id="cardName" 
                  placeholder="Nome completo" 
                  value={newPaymentMethod.cardName}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Data de Expiração</Label>
                  <Input 
                    id="cardExpiry" 
                    placeholder="MM/AA" 
                    value={newPaymentMethod.cardExpiry}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardExpiry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input 
                    id="cardCvv" 
                    placeholder="123" 
                    value={newPaymentMethod.cardCvv}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardCvv: e.target.value})}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Endereço de Cobrança</Label>
                <Input 
                  id="billingAddress" 
                  placeholder="Endereço completo" 
                  value={newPaymentMethod.billingAddress}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, billingAddress: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmitNewPaymentMethod}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando métodos de pagamento...</div>
      ) : paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-primary" size={24} />
                    <div>
                      <CardTitle>
                        {method.card_brand || 'Cartão'} •••• {method.card_last_four}
                        {method.is_default && (
                          <Badge className="ml-2 bg-primary">Padrão</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {method.billing_name} • Expira em {method.card_expiry}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {method.billing_address && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Endereço de Cobrança:</span> {method.billing_address}
                  </p>
                </CardContent>
              )}
              <CardFooter className="flex justify-between">
                {!method.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Definir como Padrão
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemove(method.id)}
                >
                  <Trash size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhum método de pagamento encontrado</CardTitle>
            <CardDescription>
              Adicione um método de pagamento para efetuar compras.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => setDialogOpen(true)}>
              Adicionar Método de Pagamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentMethodsPage;
