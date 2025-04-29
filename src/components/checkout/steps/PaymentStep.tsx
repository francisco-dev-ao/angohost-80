
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, CheckCircle } from "lucide-react";

export interface PaymentStepProps {
  paymentMethod: string | null;
  paymentMethods: any[];
  handlePaymentMethodChange: (methodId: string) => void;
  nextStep?: () => void;
  prevStep: () => void;
  isSaving: boolean;
  completedSteps: Record<string, boolean>;
}

const PaymentStep = ({ 
  paymentMethod, 
  paymentMethods, 
  handlePaymentMethodChange, 
  prevStep,
  nextStep,
  isSaving,
  completedSteps
}: PaymentStepProps) => {
  return (
    <>
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
    </>
  );
};

export default PaymentStep;
