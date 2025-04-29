
import React from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';
import { useContactProfiles } from '@/hooks/useContactProfiles';

// Import refactored components
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import CheckoutContent from './CheckoutContent';
import { motion } from 'framer-motion';

export const EnhancedCheckout = () => {
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  
  const {
    activeStep,
    setActiveStep,
    completedSteps,
    contactProfile,
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
    handleProfileChange,
    handlePaymentMethodChange,
    handleBillingCycleChange,
    handleUpdateBillingCycle,
    handleRemoveItem,
    nextStep,
    prevStep,
    createNewProfile,
  } = useCheckout();

  const {
    handleSubmit,
    isSaving,
  } = useOrderSubmission(contactProfile, profiles, paymentMethod, formData);

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
            profiles={profiles}
            isLoadingProfiles={isLoadingProfiles}
            contactProfile={contactProfile}
            handleProfileChange={handleProfileChange}
            formData={formData}
            setFormData={setFormData}
            createNewProfile={createNewProfile}
            nextStep={nextStep}
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
