
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { emailPlans } from "@/config/emailPlans";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/formatters";
import { useCart } from '@/contexts/CartContext';

const CartEmailSuggestions = () => {
  const { addToCart } = useCart();

  const handleSelectPlan = (plan: any, years: number = 1) => {
    addToCart({
      id: `email-${plan.id}-${Date.now()}`,
      title: `${plan.title} (${plan.userCount} ${plan.userCount === 1 ? 'usuário' : 'usuários'} por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: 1,
      price: plan.basePrice * years,
      basePrice: plan.basePrice,
      type: "email",
      years: years
    });
  };

  const displayPlans = emailPlans.slice(0, 2); // Show only the first 2 plans as suggestions

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicione um plano de e-mail profissional</CardTitle>
        <CardDescription>
          Complemente seu domínio com um serviço de e-mail profissional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {displayPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className="border rounded-lg p-6 bg-white hover:shadow-md transition-all relative overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(plan.basePrice)}
                </span>
                <span className="text-muted-foreground text-sm">/ano por usuário</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPlan(plan, 1)}
                >
                  Adicionar (1 ano)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleSelectPlan(plan, 3)}
                >
                  Adicionar (3 anos)
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartEmailSuggestions;
