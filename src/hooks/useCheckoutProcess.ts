
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { useOwnership } from '@/contexts/OwnershipContext';
import { toast } from 'sonner';

export const useCheckoutProcess = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items, updateItemPrice, removeFromCart } = useCart();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  const { profiles: ownershipProfiles, isLoading: isLoadingOwnershipProfiles } = useOwnership();
  
  // Changed the order: cart -> payment -> auth -> contact
  const [step, setStep] = useState<'cart' | 'payment' | 'auth' | 'contact' | 'complete'>('cart');
  const [selectedContactProfile, setSelectedContactProfile] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('1');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  // Logic for domains and email plans
  const domainItems = items.filter(item => item.type === 'domain');
  const emailItems = items.filter(item => item.type === 'email');
  const otherItems = items.filter(item => item.type !== 'domain' && item.type !== 'email');
  
  // Calculate discount based on duration
  const calculateDiscount = (years: number) => {
    if (years === 2) return 0.05; // 5% discount for 2 years
    if (years === 3) return 0.10; // 10% discount for 3 years
    if (years >= 4) return 0.15; // 15% discount for 4+ years
    return 0;
  };
  
  // Update prices based on duration
  const updatePrices = (years: number) => {
    const discount = calculateDiscount(years);
    
    items.forEach(item => {
      if (item.type !== 'domain' || years <= 5) {
        // For domains, allow up to 5 years
        // For other items, limit to 3 years max
        const actualYears = item.type !== 'domain' && years > 3 ? 3 : years;
        const discountedPrice = item.basePrice * actualYears * (1 - discount);
        updateItemPrice(item.id, discountedPrice);
      }
    });
  };
  
  // Handle duration change
  const handleDurationChange = (duration: string) => {
    const years = parseInt(duration);
    setSelectedDuration(duration);
    updatePrices(years);
  };
  
  // Proceed to next step - Modified order to follow: cart -> payment -> auth -> contact
  const nextStep = async () => {
    if (step === 'cart') {
      // From cart, go directly to payment selection
      setStep('payment');
      return;
    }
    
    if (step === 'payment') {
      if (!selectedPaymentMethod) {
        toast.error('Por favor, selecione um método de pagamento');
        return;
      }
      
      // After payment selection, check if user is logged in
      if (!user) {
        setStep('auth');
        return;
      }
      
      // User is logged in, for domains we need contact info
      if (domainItems.length > 0) {
        setStep('contact');
        return;
      }
      
      // For non-domain purchases by logged in users, go to complete
      setStep('complete');
      return;
    }
    
    if (step === 'auth') {
      if (!user) {
        setIsRedirecting(true);
        navigate('/login', { state: { returnUrl: '/enhanced-checkout' } });
        return;
      }
      
      // After authentication, for domains we need contact info
      if (domainItems.length > 0) {
        setStep('contact');
      } else {
        setStep('complete');
      }
      return;
    }
    
    if (step === 'contact') {
      if (!selectedContactProfile) {
        toast.error('Por favor, selecione ou crie um perfil de titularidade');
        return;
      }
      
      // After contact info, finalize order
      toast.success('Pedido finalizado com sucesso!');
      setStep('complete');
      return;
    }
  };
  
  // Go back to previous step - Modified for new flow
  const prevStep = () => {
    if (step === 'contact') {
      setStep('payment');
    } else if (step === 'auth') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('cart');
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  // Check if we can show email suggestions for domain customers
  const shouldShowEmailSuggestions = domainItems.length > 0 && emailItems.length === 0;
  
  return {
    step,
    nextStep,
    prevStep,
    selectedContactProfile,
    setSelectedContactProfile,
    selectedDuration,
    handleDurationChange,
    isRedirecting,
    shouldShowEmailSuggestions,
    domainItems,
    emailItems,
    otherItems,
    isLoadingProfiles,
    isLoadingOwnershipProfiles,
    contactProfiles: profiles,
    ownershipProfiles,
    calculateDiscount,
    selectedPaymentMethod,
    handlePaymentMethodChange
  };
};
