
import React from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';
import { useContactProfiles } from '@/hooks/useContactProfiles';

// Import refactored components
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import CheckoutContent from './CheckoutContent';

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
    tax,
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
        <form onSubmit={handleSubmit}>
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
