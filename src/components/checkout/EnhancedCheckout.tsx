
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import CheckoutSteps from './CheckoutSteps';
import ClientStep from './steps/ClientStep';
import DomainStep from './steps/DomainStep';
import ServiceStep from './steps/ServiceStep';
import PaymentStep from './steps/PaymentStep';
import OrderSummary from './OrderSummary';

export const EnhancedCheckout = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items, clearCart, removeFromCart, updateItemPrice } = useCart();
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
    calculateTotals();
    
    if (user) {
      setCompletedSteps(prev => ({ ...prev, client: true }));
    }
    
    if (user) {
      loadUserProfile();
      loadPaymentMethods();
    }
    
    setIsLoading(false);
  }, [user, items]);
  
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setContactProfile(profiles[0].id);
      setCompletedSteps(prev => ({ ...prev, client: true }));
    }
  }, [profiles]);
  
  const calculateTotals = () => {
    const cartSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartTax = cartSubtotal * 0.14; // 14% IVA
    const cartTotal = cartSubtotal + cartTax - discount;
    
    setSubtotal(cartSubtotal);
    setTax(cartTax);
    setTotal(cartTotal);
  };
  
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
    
    // Recalcular preços com base no ciclo de cobrança
    items.forEach(item => {
      if (item.type === 'service' || item.type === 'hosting') {
        const basePrice = item.basePrice;
        let newPrice = basePrice;
        
        if (cycle === 'monthly') {
          // Preço mensal (sem desconto)
          newPrice = basePrice;
        } else {
          // Preço anual (com desconto de 15%)
          newPrice = basePrice * 0.85 * 12;
        }
        
        updateItemPrice(item.id, newPrice);
      }
    });
    
    // Recalcular totais após atualização dos preços
    setTimeout(() => calculateTotals(), 0);
  };
  
  const handleUpdateBillingCycle = (itemId: string, years: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;
    
    let newPrice = item.basePrice;
    
    // Aplicar desconto com base no número de anos
    if (years === 2) {
      newPrice = newPrice * 0.95 * years; // 5% de desconto para 2 anos
    } else if (years === 3) {
      newPrice = newPrice * 0.90 * years; // 10% de desconto para 3 anos
    } else {
      newPrice = newPrice * years;
    }
    
    // Atualizar o item com o novo preço e período
    const updatedItem = {
      ...item,
      price: newPrice,
      years: years
    };
    
    // Remover o item antigo e adicionar o atualizado (simulando uma atualização)
    updateItemPrice(itemId, newPrice);
    
    // Recalcular totais após atualização
    setTimeout(() => calculateTotals(), 0);
    
    toast.success(`Período de contratação alterado para ${years} ${years === 1 ? 'ano' : 'anos'}`);
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removido do pedido');
    
    // Recalcular totais após remoção
    setTimeout(() => calculateTotals(), 0);
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
        
        <CheckoutSteps 
          activeStep={activeStep} 
          completedSteps={completedSteps} 
          onStepChange={setActiveStep}
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
              <TabsContent value="client">
                <Card>
                  <CardContent className="pt-6">
                    <ClientStep
                      profiles={profiles}
                      isLoadingProfiles={isLoadingProfiles}
                      contactProfile={contactProfile}
                      handleProfileChange={handleProfileChange}
                      formData={formData}
                      setFormData={setFormData}
                      createNewProfile={createNewProfile}
                      nextStep={nextStep}
                      completedSteps={completedSteps}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="domain">
                <Card>
                  <CardContent className="pt-6">
                    <DomainStep
                      prevStep={prevStep}
                      nextStep={nextStep}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="service">
                <Card>
                  <CardContent className="pt-6">
                    <ServiceStep
                      items={items}
                      prevStep={prevStep}
                      nextStep={nextStep}
                      onRemoveItem={handleRemoveItem}
                      onUpdateBillingCycle={handleUpdateBillingCycle}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardContent className="pt-6">
                    <PaymentStep
                      paymentMethod={paymentMethod}
                      paymentMethods={paymentMethods}
                      handlePaymentMethodChange={handlePaymentMethodChange}
                      prevStep={prevStep}
                      isSaving={isSaving || isSavingCart}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        <div>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            tax={tax}
            discount={discount}
            total={total}
            billingCycle={billingCycle}
            handleBillingCycleChange={handleBillingCycleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
