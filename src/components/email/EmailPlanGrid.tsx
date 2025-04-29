
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface EmailPlanGridProps {
  emailPlans: any[];
  selectedTab: string;
  userCount: number;
  period: string;
  handlePurchase: (plan: any) => void;
}

const EmailPlanGrid = ({
  emailPlans,
  selectedTab,
  userCount,
  period,
  handlePurchase,
}: EmailPlanGridProps) => {
  const calculatePrice = (basePrice: number) => {
    const years = parseInt(period);
    // Apply discount for multi-year purchases
    const discount = years >= 3 ? 0.10 : years >= 2 ? 0.05 : 0;
    
    let totalPrice = basePrice * userCount * years;
    if (discount > 0) {
      totalPrice = totalPrice - (totalPrice * discount);
    }
    
    return formatPrice(totalPrice);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {emailPlans.map((plan) => {
        const isCurrentPlan = plan.id === selectedTab;
        const years = parseInt(period);
        
        return (
          <div 
            key={plan.id} 
            className={`transition-all duration-300 transform ${isCurrentPlan ? 'scale-105 shadow-lg' : 'opacity-85'}`}
          >
            <Card className={`overflow-hidden h-full flex flex-col ${isCurrentPlan ? 'border-primary shadow-lg' : 'border-muted'}`}>
              <div className={`p-6 ${isCurrentPlan ? 'bg-primary/5' : ''}`}>
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold">{calculatePrice(plan.basePrice)}</span>
                  <span className="text-muted-foreground">/{userCount} {userCount === 1 ? 'usuário' : 'usuários'}/{period} {parseInt(period) === 1 ? 'ano' : 'anos'}</span>
                </div>
                
                {years > 1 && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    Inclui desconto de {years >= 3 ? '10%' : '5%'} para {years} anos
                  </div>
                )}
                
                {years === 1 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Renovação: {formatPrice(plan.renewalPrice)} por usuário/ano
                  </div>
                )}
              </div>
              
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`flex-shrink-0 mt-1 flex items-center justify-center h-5 w-5 rounded-full ${
                        feature.included ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {feature.included && <Check className="h-3 w-3" />}
                      </span>
                      <span className={!feature.included ? "text-muted-foreground" : "text-sm"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  variant={isCurrentPlan ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => handlePurchase(plan)}
                >
                  Comprar
                </Button>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default EmailPlanGrid;
