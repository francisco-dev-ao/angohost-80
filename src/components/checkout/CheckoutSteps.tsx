
import React from "react";
import { Check } from "lucide-react";

interface CheckoutStepsProps {
  activeStep: string;
  completedSteps: Record<string, boolean>;
  onStepChange: (stepId: string) => void;
}

const CheckoutSteps = ({ activeStep, completedSteps, onStepChange }: CheckoutStepsProps) => {
  const steps = [
    { id: 'client', label: 'Dados do Cliente' },
    { id: 'domain', label: 'Domínios' },
    { id: 'service', label: 'Serviços' },
    { id: 'payment', label: 'Pagamento' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index, array) => (
        <React.Fragment key={step.id}>
          <button 
            onClick={() => onStepChange(step.id)}
            className={`flex flex-col items-center ${activeStep === step.id ? 'text-primary' : completedSteps[step.id] ? 'text-green-600' : 'text-gray-400'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              activeStep === step.id ? 'bg-primary text-white' : 
              completedSteps[step.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            }`}>
              {completedSteps[step.id] ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className="text-xs sm:text-sm">{step.label}</span>
          </button>
          
          {index < array.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${
              completedSteps[step.id] ? 'bg-green-300' : 'bg-gray-200'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
