
import React, { useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';

// Import refactored components
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import CheckoutContent from './CheckoutContent';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const EnhancedCheckout = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  const {
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
    handleUpdateBillingCycle,
    handleRemoveItem,
    nextStep,
    prevStep,
  } = useCheckout();

  const {
    handleSubmit,
    isSaving,
  } = useOrderSubmission(paymentMethod, formData);

  // Modified to handle the new checkout flow
  const handlePayButtonClick = () => {
    // If user is not logged in, redirect to login with return URL
    if (!user) {
      toast.info('Entre com sua conta para continuar');
      navigate('/login', { state: { returnUrl: '/enhanced-checkout' } });
      return;
    }
    
    nextStep();
  };

  if (isLoading) {
    return (
      <motion.div 
        className="py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Carregando...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-50 to-white"
    >
      <motion.div 
        className="mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-primary">Finalizar Compra</h1>
        <p className="text-muted-foreground mb-6">Complete os passos abaixo para finalizar sua compra</p>
        
        <CheckoutSteps 
          activeStep={activeStep} 
          completedSteps={completedSteps} 
          onStepChange={setActiveStep}
        />
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2">
          <CheckoutContent
            activeStep={activeStep}
            completedSteps={completedSteps}
            formData={formData}
            setFormData={setFormData}
            nextStep={handlePayButtonClick} // Use our new handler for authentication check
            prevStep={prevStep}
            items={items}
            handleRemoveItem={handleRemoveItem}
            handleUpdateBillingCycle={handleUpdateBillingCycle}
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            handlePaymentMethodChange={handlePaymentMethodChange}
            isSaving={isSaving}
            setActiveStep={setActiveStep}
          />
        </form>

        <div>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            total={total}
            billingCycle={billingCycle}
            handleBillingCycleChange={handleBillingCycleChange}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedCheckout;
