
import React from "react";
import { CardTitle, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/utils/formatters";
import { CheckCircle } from "lucide-react";
import { CartItem } from '@/contexts/CartContext';
import { motion } from "framer-motion";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  billingCycle: string;
  handleBillingCycleChange: (cycle: string) => void;
}

const OrderSummary = ({
  items,
  subtotal,
  tax,
  discount,
  total,
  billingCycle,
  handleBillingCycleChange
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-8">
      <CardContent className="pt-6">
        <CardTitle className="mb-4">Resumo do Pedido</CardTitle>
        
        <div>
          <div className="space-y-3 mb-4">
            {items.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="flex justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="text-sm">
                  <div className="font-medium">{item.title}</div>
                  {item.quantity > 1 && (
                    <div className="text-muted-foreground">{item.quantity} x {formatPrice(item.basePrice)}</div>
                  )}
                  {item.domain && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Domínio: {item.domain}
                    </div>
                  )}
                  {item.years && (
                    <div className="text-xs text-muted-foreground">
                      {item.years} {item.years === 1 ? 'ano' : 'anos'}
                    </div>
                  )}
                </div>
                <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="my-4 pb-4 border-b"
          >
            <Label className="block mb-2">Ciclo de cobrança</Label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 text-center text-sm ${
                  billingCycle === 'monthly' ? 'bg-primary text-white' : 'bg-background'
                } transition-all duration-200 hover:bg-primary/90 hover:text-white`}
                onClick={() => handleBillingCycleChange('monthly')}
              >
                Mensal
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-center text-sm ${
                  billingCycle === 'annual' ? 'bg-primary text-white' : 'bg-background'
                } transition-all duration-200 hover:bg-primary/90 hover:text-white`}
                onClick={() => handleBillingCycleChange('annual')}
              >
                Anual
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">-15%</span>
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (14%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {discount > 0 && (
              <motion.div 
                className="flex justify-between text-green-600"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <span>Desconto</span>
                <span>-{formatPrice(discount)}</span>
              </motion.div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Total</span>
              <motion.span
                key={total}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatPrice(total)}
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Mais de 2000 clientes já confiam!</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Atendimento 24/7 e satisfação garantida
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
