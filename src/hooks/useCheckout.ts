
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export const useCheckout = () => {
  const { items, removeFromCart } = useCart();
  const { user } = useSupabaseAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [completedSteps, setCompletedSteps] = useState({
    review: false,
    payment: false
  });
  
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock payment methods for demo - in a real app, fetch these from API or Supabase
  const paymentMethods = [
    { id: 'card', name: 'Cartão de Crédito', icon: 'credit-card' },
    { id: 'transfer', name: 'Transferência Bancária', icon: 'bank' },
    { id: 'wallet', name: 'Saldo da Carteira', icon: 'wallet', requiredBalance: true }
  ];
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = 0; // Set discount logic as needed
  const total = subtotal - discount;
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mark complete when user has items in cart
  useEffect(() => {
    if (items.length > 0) {
      setCompletedSteps(prev => ({ ...prev, review: true }));
    } else {
      setCompletedSteps(prev => ({ ...prev, review: false }));
    }
  }, [items]);
  
  // Mark payment step complete when method is selected
  useEffect(() => {
    if (paymentMethod) {
      setCompletedSteps(prev => ({ ...prev, payment: true }));
    } else {
      setCompletedSteps(prev => ({ ...prev, payment: false }));
    }
  }, [paymentMethod]);
  
  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);
  
  // Handle payment method change
  const handlePaymentMethodChange = (id: string) => {
    setPaymentMethod(id);
  };
  
  // Handle billing cycle change
  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle);
  };
  
  // Handle item removal
  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };
  
  // Handle billing cycle update for specific item
  const handleUpdateBillingCycle = (id: string, years: number) => {
    // Implement logic to update item's billing cycle
    console.log(`Updating item ${id} to ${years} years`);
  };
  
  // Go to next step
  const nextStep = () => {
    if (activeStep < 1) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };
  
  return {
    activeStep,
    setActiveStep,
    completedSteps,
    paymentMethod,
    paymentMethods,
    formData,
    setFormData,
    subtotal,
    discount,
    total,
    billingCycle,
    isLoading,
    items,
    handlePaymentMethodChange,
    handleBillingCycleChange,
    handleRemoveItem,
    handleUpdateBillingCycle,
    nextStep,
    prevStep,
  };
};
