
import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface PlanSummaryProps {
  selectedPlan: any;
  config: {
    userCount: number;
    period: string;
    domainOption: string;
  };
}

const PlanSummary = ({ selectedPlan, config }: PlanSummaryProps) => {
  const calculatePrice = () => {
    if (!selectedPlan) return formatPrice(0);
    
    const years = parseInt(config.period);
    // Apply discount for multi-year purchases
    const discount = years >= 3 ? 0.10 : years >= 2 ? 0.05 : 0;
    
    let totalPrice = selectedPlan.basePrice * config.userCount * years;
    if (discount > 0) {
      totalPrice = totalPrice - (totalPrice * discount);
    }
    
    // Add domain price if registering new one
    const domainPrice = config.domainOption === "new" ? 2000 : 0;
    return formatPrice(totalPrice + domainPrice);
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Preço Total</Label>
        <div className="col-span-3">
          <div className="font-medium text-lg">
            {calculatePrice()}
          </div>
          {parseInt(config.period) > 1 && (
            <div className="text-sm text-green-600">
              Inclui desconto de {parseInt(config.period) >= 3 ? '10%' : '5%'} para {config.period} anos
            </div>
          )}
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Recursos incluídos:</h3>
        <ul className="space-y-1.5">
          {selectedPlan?.features?.map((feature: any, index: number) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <span className="h-4 w-4 block" />
              )}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PlanSummary;
