
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { emailPlans } from '@/config/emailPlans';
import { formatPrice } from '@/utils/formatters';
import { Check } from 'lucide-react';

const CartEmailSuggestions = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleSelectPlan = (plan: any) => {
    navigate('/professional-email');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Profissional para seu Domínio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Complete seu domínio com um serviço de email profissional
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {emailPlans.map(plan => (
            <Card key={plan.id} className={`border ${plan.popular ? 'border-primary' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                <div className="text-sm text-muted-foreground">{plan.description}</div>
                <div className="mt-2 font-bold text-xl">{formatPrice(plan.basePrice)}<span className="text-sm font-normal text-muted-foreground">/usuário/ano</span></div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-4 text-sm">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    feature.included && (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/20 p-0.5 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span>{feature.text}</span>
                      </li>
                    )
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSelectPlan(plan)} 
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  Ver planos
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartEmailSuggestions;
