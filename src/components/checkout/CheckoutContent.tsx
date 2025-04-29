
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ClientStep from './steps/ClientStep';
import DomainStep from './steps/DomainStep';
import ServiceStep from './steps/ServiceStep';
import PaymentStep from './steps/PaymentStep';

interface CheckoutContentProps {
  activeStep: string;
  completedSteps: Record<string, boolean>;
  profiles: any[];
  isLoadingProfiles: boolean;
  contactProfile: string | null;
  handleProfileChange: (profileId: string) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>>;
  createNewProfile: () => void;
  nextStep: () => void;
  prevStep: () => void;
  items: any[];
  handleRemoveItem: (id: string) => void;
  handleUpdateBillingCycle: (itemId: string, years: number) => void;
  paymentMethod: string | null;
  paymentMethods: any[];
  handlePaymentMethodChange: (methodId: string) => void;
  isSaving: boolean;
  setActiveStep: (step: string) => void;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  activeStep,
  completedSteps,
  profiles,
  isLoadingProfiles,
  contactProfile,
  handleProfileChange,
  formData,
  setFormData,
  createNewProfile,
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
}) => {
  return (
    <div className="md:col-span-2">
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
                isSaving={isSaving}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckoutContent;
