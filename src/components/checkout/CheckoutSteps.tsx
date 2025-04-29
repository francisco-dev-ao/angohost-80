
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface CheckoutStepsProps {
  activeStep: string;
  completedSteps: Record<string, boolean>;
  onStepChange: (stepId: string) => void;
}

const CheckoutSteps = ({ activeStep, completedSteps, onStepChange }: CheckoutStepsProps) => {
  const steps = [
    { id: 'client', label: 'Dados do Cliente' },
    { id: 'service', label: 'Serviços' },
    { id: 'payment', label: 'Pagamento' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index, array) => (
        <React.Fragment key={step.id}>
          <motion.button 
            onClick={() => onStepChange(step.id)}
            className={`flex flex-col items-center ${activeStep === step.id ? 'text-primary font-semibold' : completedSteps[step.id] ? 'text-green-600' : 'text-gray-400'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              activeStep === step.id ? 'bg-primary text-white' : 
              completedSteps[step.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            }`}>
              {completedSteps[step.id] ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <span className="text-xs sm:text-sm md:text-base">{step.label}</span>
          </motion.button>
          
          {index < array.length - 1 && (
            <motion.div 
              className={`flex-1 h-1.5 mx-2 rounded-full ${
                completedSteps[step.id] ? 'bg-green-300' : 'bg-gray-200'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
