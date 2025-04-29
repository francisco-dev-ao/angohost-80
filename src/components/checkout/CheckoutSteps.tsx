
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  activeStep: number;
  completedSteps: Record<string, boolean>;
  onStepChange: (step: number) => void;
}

const CheckoutSteps = ({ activeStep, completedSteps, onStepChange }: CheckoutStepsProps) => {
  // Define steps
  const steps = [
    { id: 'review', name: 'Revisão' },
    { id: 'payment', name: 'Pagamento' },
  ];
  
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps[step.id];
          const isClickable = isCompleted || index <= activeStep;
          
          return (
            <li key={step.id} className={`relative flex-1 ${index !== 0 ? 'pl-8' : ''}`}>
              {index !== 0 && (
                <div 
                  className="absolute left-0 top-1/2 -mt-px w-full h-0.5" 
                  style={{ backgroundColor: isCompleted ? 'var(--primary)' : 'var(--muted)' }}
                ></div>
              )}
              
              <button
                type="button"
                className={`relative flex items-center justify-center w-8 h-8 rounded-full
                ${isActive ? 'ring-2 ring-offset-2 ring-primary' : ''}
                ${isCompleted ? 'bg-primary' : 'bg-white border'}
                ${!isClickable ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange(index)}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </button>
              
              <span className="absolute left-full top-0 -translate-x-1/2 mt-10 text-sm font-medium text-center">
                {step.name}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
