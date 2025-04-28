
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  
  // Form data states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    creditCardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.14; // 14% IVA in Angola
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      clearCart();
      toast.success('Pagamento processado com sucesso!');
      navigate('/', { replace: true });
    }, 2000);
  };
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Carrinho vazio</h1>
            <p className="mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
            <Button onClick={() => navigate('/domains')}>Pesquisar domínios</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
                <CardDescription>Informe seus dados para a fatura</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Nome completo" 
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
                        placeholder="seu@email.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        placeholder="+244 999 999 999"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="Seu endereço" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>
                  Escolha o método de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit-card" onValueChange={(value) => setPaymentMethod(value)}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="credit-card">Cartão</TabsTrigger>
                    <TabsTrigger value="bank-transfer">Transferência</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit-card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Número do Cartão</Label>
                      <Input 
                        id="card-number"
                        name="creditCardNumber" 
                        placeholder="0000 0000 0000 0000" 
                        value={formData.creditCardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Data de Validade</Label>
                        <Input 
                          id="expiry" 
                          name="expiryDate" 
                          placeholder="MM/AA" 
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          name="cvv"  
                          placeholder="123" 
                          value={formData.cvv}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="bank-transfer">
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-medium">Dados bancários para transferência:</p>
                        <p>Banco: Banco de Angola</p>
                        <p>Conta: 1234567890</p>
                        <p>NIB: AO012345678901234567890123</p>
                        <p>Titular: Empresa de Hosting</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Após realizar a transferência, envie o comprovante para o email financeiro@empresa.com
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal">
                    <div className="text-center p-6">
                      <p className="mb-4">
                        Você será redirecionado para o site do PayPal para concluir o pagamento.
                      </p>
                      <Button className="w-full">
                        Pagar com PayPal
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.basePrice)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {formatPrice(item.price)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (14%)</span>
                <span>{formatPrice(calculateTax())}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              disabled={loading}
              onClick={handleSubmitPayment}
            >
              {loading ? (
                <>Processando...</>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> 
                  Finalizar Pagamento
                </>
              )}
            </Button>
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                className="text-muted-foreground"
                onClick={() => navigate('/cart')}
              >
                Voltar para o carrinho
              </Button>
            </div>
            
            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 mb-2">
                <Check className="h-3 w-3" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3" />
                <span>Suporte técnico 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
