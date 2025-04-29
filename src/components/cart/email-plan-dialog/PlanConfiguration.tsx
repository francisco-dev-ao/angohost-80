
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/utils/formatters";

interface PlanConfigurationProps {
  config: {
    userCount: number;
    period: string;
    domainOption: string;
    newDomainName?: string;
    selectedExistingDomain?: string;
  };
  onConfigChange: (key: string, value: any) => void;
}

const PlanConfiguration = ({
  config,
  onConfigChange,
}: PlanConfigurationProps) => {
  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      onConfigChange("userCount", value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Número de usuários</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            className="w-24"
            type="number"
            min="1"
            max="1000"
            value={config.userCount}
            onChange={handleUserCountChange}
          />
          <span className="text-sm text-muted-foreground">
            {config.userCount === 1 ? "usuário" : "usuários"}
          </span>
        </div>
      </div>

      <div>
        <Label>Período</Label>
        <RadioGroup
          className="grid grid-cols-3 gap-4 mt-2"
          value={config.period}
          onValueChange={(value) => onConfigChange("period", value)}
        >
          {["1", "2", "3"].map((year) => {
            // Calculate discount
            const discount = year === "2" ? 0.05 : year === "3" ? 0.10 : 0;
            
            return (
              <div key={year} className="relative">
                <RadioGroupItem
                  value={year}
                  id={`period-${year}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`period-${year}`}
                  className="flex flex-col items-center justify-center border rounded-md p-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted/50"
                >
                  <span className="font-medium">{year}</span>
                  <span className="text-xs">{year === "1" ? "ano" : "anos"}</span>
                  {discount > 0 && (
                    <span className="mt-1 text-xs px-1.5 py-0.5 rounded-full bg-green-500 text-white">
                      -{discount * 100}%
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <p className="text-sm text-muted-foreground mt-2">
          Pagamento a cada {config.period} {parseInt(config.period) === 1 ? "ano" : "anos"}
        </p>
      </div>
    </div>
  );
};

export default PlanConfiguration;
