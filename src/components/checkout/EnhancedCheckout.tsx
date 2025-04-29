
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
                      isSaving={isSaving}
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
