
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Import step components
import DomainStep from './steps/DomainStep';
import ServiceStep from './steps/ServiceStep';
import PaymentStep from './steps/PaymentStep';

interface CheckoutContentProps {
  activeStep: number;
  completedSteps: Record<string, boolean>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
  prevStep: () => void;
  items: any[];
  handleRemoveItem: (id: string) => void;
  handleUpdateBillingCycle: (id: string, years: number) => void;
  paymentMethod: string | null;
  paymentMethods: any[];
  handlePaymentMethodChange: (id: string) => void;
  isSaving: boolean;
  setActiveStep: (step: number) => void;
}

const CheckoutContent = ({
  activeStep,
  completedSteps,
  formData,
  setFormData,
  nextStep,
  prevStep,
  items,
  handleRemoveItem,
  handleUpdateBillingCycle,
  paymentMethod,
  paymentMethods,
  handlePaymentMethodChange,
  isSaving,
  setActiveStep,
}: CheckoutContentProps) => {
  
  // Function to render the active step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Cart Review
        return (
          <ServiceStep 
            items={items} 
            handleRemoveItem={handleRemoveItem} 
            handleUpdateBillingCycle={handleUpdateBillingCycle}
            nextStep={nextStep}
            completedSteps={completedSteps}
          />
        );
      case 1: // Payment Method
        return (
          <PaymentStep 
            paymentMethod={paymentMethod} 
            paymentMethods={paymentMethods} 
            handlePaymentMethodChange={handlePaymentMethodChange} 
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            isSaving={isSaving}
            completedSteps={completedSteps}
          />
        );
      default:
        return <div>Passo não encontrado</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutContent;
