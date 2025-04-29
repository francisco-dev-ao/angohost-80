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
    
    const basePrice = selectedPlan.basePrice * config.userCount * parseInt(config.period);
    const domainPrice = config.domainOption === "new" ? 2000 : 0;
    return formatPrice(basePrice + domainPrice);
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Preço Total</Label>
        <div className="col-span-3 font-medium text-lg">
          {calculatePrice()}
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
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PlanSummary;
