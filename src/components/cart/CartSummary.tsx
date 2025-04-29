
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatters";
import { AlertCircle, Info, ShoppingCart, Clock, Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  hasUnownedDomains: boolean;
  hasDomains: boolean; 
  selectedBillingPeriod: string;
  onBillingPeriodChange: (period: string) => void;
  onRecalculatePrices: (period: string) => void;
}

const CartSummary = ({ 
  subtotal, 
  hasUnownedDomains,
  hasDomains,
  selectedBillingPeriod,
  onBillingPeriodChange,
  onRecalculatePrices,
}: CartSummaryProps) => {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateDiscount = () => {
      if (subtotal >= 500000) return 0.1; // 10% discount
      if (subtotal >= 250000) return 0.05; // 5% discount
      return 0;
    };

    const discountValue = calculateDiscount();
    setDiscount(discountValue);
    setTotal(subtotal - (subtotal * discountValue));
  }, [subtotal]);

  const handlePeriodChange = (period: string) => {
    onBillingPeriodChange(period);
    // Recalcular preços quando o período muda
    onRecalculatePrices(period);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border rounded-lg shadow-md bg-white overflow-hidden h-fit sticky top-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-background p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Billing cycle selection */}
        <div className="rounded-lg border p-4 bg-muted/20">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ciclo de Cobrança
          </h3>
          
          <RadioGroup 
            value={selectedBillingPeriod} 
            onValueChange={handlePeriodChange}
            className="grid grid-cols-5 gap-2"
          >
            {["1", "2", "3", "4", "5"].map((period) => (
              <div key={period} className="relative">
                <RadioGroupItem
                  value={period}
                  id={`period-${period}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`period-${period}`}
                  className={`flex flex-col items-center justify-center border rounded-md p-2 cursor-pointer transition-all ${
                    selectedBillingPeriod === period
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm font-medium">{period}</span>
                  <span className="text-xs">{period === "1" ? "ano" : "anos"}</span>
                  {period !== "1" && (
                    <span className="text-xs mt-1 bg-primary-foreground/20 px-1 rounded">
                      -{(parseInt(period) - 1) * 5}%
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto ({(discount * 100)}%)</span>
              <span>-{formatPrice(subtotal * discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-2 gap-2" 
          onClick={() => navigate('/enhanced-checkout')}
          disabled={hasUnownedDomains || !hasDomains}
        >
          <ShoppingCart className="h-4 w-4" />
          Finalizar Compra
        </Button>
        
        {!hasDomains && (
          <div className="text-sm text-amber-500 mt-2 flex items-center gap-2 p-3 bg-amber-50 rounded-md">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>É necessário adicionar pelo menos um domínio para prosseguir com a compra</span>
          </div>
        )}
        
        {hasUnownedDomains && (
          <div className="text-sm text-red-500 mt-2 flex items-center gap-2 p-3 bg-red-50 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Preencha as informações de titularidade para todos os domínios antes de continuar</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-green-500" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
