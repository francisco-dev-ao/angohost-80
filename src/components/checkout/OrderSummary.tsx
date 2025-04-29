
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from '@/utils/formatters';
import { motion } from 'framer-motion';

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  billingCycle: string;
  handleBillingCycleChange: (cycle: string) => void;
}

const OrderSummary = ({
  items,
  subtotal,
  discount,
  total,
  billingCycle,
  handleBillingCycleChange
}: OrderSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Ciclo de Cobrança</h3>
            <RadioGroup 
              value={billingCycle} 
              onValueChange={handleBillingCycleChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Mensal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual">Anual</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="text-sm">
                      <p>{item.title}</p>
                      {item.domain && (
                        <span className="text-xs text-muted-foreground block">
                          Domínio: {item.domain}
                        </span>
                      )}
                      {item.renewalDate && (
                        <span className="text-xs text-muted-foreground block">
                          Renovação: {item.renewalDate}
                        </span>
                      )}
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              Nenhum item no carrinho
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary;
