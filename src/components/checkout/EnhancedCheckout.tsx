import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { formatPrice } from '@/utils/formatters';
import { Check, CreditCard, Banknote, PlusCircle, User, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import DomainSearch from '@/components/DomainSearch';

export const EnhancedCheckout = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items, clearCart } = useCart();
  const { saveCartAsOrder, isSaving } = useSaveOrder();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  
  const [activeStep, setActiveStep] = useState('client');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    client: false,
    domain: false,
    service: false,
    payment: false
  });
  
  const [contactProfile, setContactProfile] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [billingCycle, setBillingCycle] = useState('annual');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCart, setIsSavingCart] = useState(false);
  
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [addingDomain, setAddingDomain] = useState(false);
  
  useEffect(() => {
    const cartSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartTax = cartSubtotal * 0.14; // 14% IVA
    const cartTotal = cartSubtotal + cartTax - discount;
    
    setSubtotal(cartSubtotal);
    setTax(cartTax);
    setTotal(cartTotal);
    
    if (user) {
      setCompletedSteps(prev => ({ ...prev, client: true }));
    }
    
    if (user) {
      loadUserProfile();
      loadPaymentMethods();
    }
    
    setIsLoading(false);
  }, [user, items, discount, billingCycle]);
  
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setContactProfile(profiles[0].id);
      setCompletedSteps(prev => ({ ...prev, client: true }));
    }
  }, [profiles]);
  
  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, address')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        setFormData({
          name: data.full_name || user.user_metadata?.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const loadPaymentMethods = async () => {
    if (!user) return;
    
    try {
      let defaultMethods = [
        { 
          id: 'bank_transfer', 
          name: 'Transferência Bancária', 
          is_active: true,
          payment_type: 'bank_transfer',
          description: 'Pague por transferência bancária e envie o comprovante'
        }
      ];
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      const allMethods = [...defaultMethods, ...(data || [])];
      setPaymentMethods(allMethods);
      
      if (allMethods.length > 0) {
        setPaymentMethod(allMethods[0].id);
        setCompletedSteps(prev => ({ ...prev, payment: true }));
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
      
      const bankTransfer = { 
        id: 'bank_transfer', 
        name: 'Transferência Bancária', 
        is_active: true,
        payment_type: 'bank_transfer',
        description: 'Pague por transferência bancária e envie o comprovante'
      };
      setPaymentMethods([bankTransfer]);
      setPaymentMethod('bank_transfer');
    }
  };
  
  const handleProfileChange = (profileId: string) => {
    setContactProfile(profileId);
    setCompletedSteps(prev => ({ ...prev, client: true }));
  };
  
  const handlePaymentMethodChange = (methodId: string) => {
    setPaymentMethod(methodId);
    setCompletedSteps(prev => ({ ...prev, payment: true }));
  };
  
  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle);
    
    if (cycle === 'monthly') {
      // Calculate prices for monthly billing
    } else {
      // Calculate prices for annual billing with potential discount
    }
  };
  
  const handleDomainSelection = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
    
    setCompletedSteps(prev => ({ ...prev, domain: true }));
  };
  
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
    }
  };
  
  const nextStep = () => {
    if (activeStep === 'client') setActiveStep('domain');
    else if (activeStep === 'domain') setActiveStep('service');
    else if (activeStep === 'service') setActiveStep('payment');
  };
  
  const prevStep = () => {
    if (activeStep === 'payment') setActiveStep('service');
    else if (activeStep === 'service') setActiveStep('domain');
    else if (activeStep === 'domain') setActiveStep('client');
  };
  
  const createNewProfile = () => {
    navigate('/client/contact-profiles?returnTo=/checkout');
  };

  if (isLoading) {
    return <div className="py-8 text-center">Carregando...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Finalizar Compra</h1>
        
        <div className="flex items-center justify-between mt-6 mb-8">
          {[
            { id: 'client', label: 'Dados do Cliente' },
            { id: 'domain', label: 'Domínios' },
            { id: 'service', label: 'Serviços' },
            { id: 'payment', label: 'Pagamento' }
          ].map((step, index, array) => (
            <React.Fragment key={step.id}>
              <button 
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center ${activeStep === step.id ? 'text-primary' : completedSteps[step.id] ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  activeStep === step.id ? 'bg-primary text-white' : 
                  completedSteps[step.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                }`}>
                  {completedSteps[step.id] ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs sm:text-sm">{step.label}</span>
              </button>
              
              {index < array.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  completedSteps[step.id] ? 'bg-green-300' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
              <TabsContent value="client">
                <Card>
                  <CardContent className="pt-6">
                    {isLoadingProfiles ? (
                      <div className="text-center py-4">Carregando perfis de contato...</div>
                    ) : (
                      <>
                        <CardTitle className="mb-4">Dados do Cliente</CardTitle>
                        
                        {profiles.length > 0 ? (
                          <div className="space-y-4">
                            <RadioGroup 
                              value={contactProfile || undefined}
                              onValueChange={handleProfileChange}
                            >
                              <div className="space-y-4">
                                {profiles.map((profile) => (
                                  <div 
                                    key={profile.id} 
                                    className={`flex items-center justify-between border rounded-md p-4 ${
                                      contactProfile === profile.id ? 'border-primary' : 'border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <RadioGroupItem value={profile.id} id={`profile-${profile.id}`} />
                                      <Label htmlFor={`profile-${profile.id}`} className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{profile.name}</span>
                                      </Label>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {profile.document}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={createNewProfile}
                              className="w-full"
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Criar novo perfil de contato
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="mb-4">Por favor, preencha seus dados para continuar:</p>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                  id="address"
                                  name="address"
                                  value={formData.address}
                                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="link"
                              onClick={createNewProfile}
                              className="px-0"
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Ou crie um perfil de contato para utilizar futuramente
                            </Button>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            type="button" 
                            onClick={nextStep} 
                            disabled={!completedSteps.client && profiles.length > 0 && !contactProfile}
                          >
                            Próximo
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="domain">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="mb-4">Domínios</CardTitle>
                    <CardDescription className="mb-6">
                      Pesquise e adicione domínios ao seu pedido
                    </CardDescription>
                    
                    <div className="mb-6">
                      <DomainSearch />
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                      >
                        Próximo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="service">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="mb-4">Serviços Adicionais</CardTitle>
                    <CardDescription className="mb-6">
                      Adicione serviços complementares ao seu pedido
                    </CardDescription>
                    
                    <div className="space-y-4">
                      {items.filter(item => item.type !== 'domain').map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(item.price)}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} x {formatPrice(item.basePrice)}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-8">
                        <h3 className="font-medium mb-4">Serviços Recomendados</h3>
                        
                        <div className="border rounded-md p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Proteção SSL</h4>
                            <p className="text-sm text-muted-foreground">Certificado SSL para garantir a segurança do seu site</p>
                          </div>
                          <Button variant="outline">
                            Adicionar
                            <PlusCircle className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                      >
                        Próximo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="mb-4">Método de Pagamento</CardTitle>
                    
                    <RadioGroup 
                      value={paymentMethod || undefined}
                      onValueChange={handlePaymentMethodChange}
                      className="space-y-4"
                    >
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id} 
                          className={`flex items-center justify-between border rounded-md p-4 ${
                            paymentMethod === method.id ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                            <Label htmlFor={`payment-${method.id}`} className="flex items-center space-x-2">
                              {method.payment_type === 'bank_transfer' ? (
                                <Banknote className="h-4 w-4" />
                              ) : (
                                <CreditCard className="h-4 w-4" />
                              )}
                              <span>{method.name || 'Método de Pagamento'}</span>
                            </Label>
                          </div>
                          {method.description && (
                            <div className="hidden md:block text-sm text-muted-foreground">
                              {method.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSaving || !paymentMethod}
                      >
                        {isSaving ? 'Processando...' : 'Finalizar Compra'}
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardContent className="pt-6">
              <CardTitle className="mb-4">Resumo do Pedido</CardTitle>
              
              <div>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="text-sm">
                        <div className="font-medium">{item.title}</div>
                        {item.quantity > 1 && (
                          <div className="text-muted-foreground">{item.quantity} x {formatPrice(item.basePrice)}</div>
                        )}
                      </div>
                      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="my-4 pb-4 border-b">
                  <Label className="block mb-2">Ciclo de cobrança</Label>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center text-sm ${
                        billingCycle === 'monthly' ? 'bg-primary text-white' : 'bg-background'
                      }`}
                      onClick={() => handleBillingCycleChange('monthly')}
                    >
                      Mensal
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center text-sm ${
                        billingCycle === 'annual' ? 'bg-primary text-white' : 'bg-background'
                      }`}
                      onClick={() => handleBillingCycleChange('annual')}
                    >
                      Anual
                      <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">-15%</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (14%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Mais de 2000 clientes já confiam!</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Atendimento 24/7 e satisfação garantida
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
