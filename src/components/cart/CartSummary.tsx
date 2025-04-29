
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatters";
import { AlertCircle, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
    <div className="border rounded-lg p-6 h-fit sticky top-8">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
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
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-medium">Período de contratação</h3>
        <select
          value={selectedBillingPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="1">1 ano</option>
          <option value="2">2 anos</option>
          <option value="3">3 anos</option>
          <option value="4">4 anos</option>
          <option value="5">5 anos</option>
        </select>
      </div>
      
      <Button 
        className="w-full mt-6" 
        onClick={() => navigate('/enhanced-checkout')}
        disabled={hasUnownedDomains || !hasDomains}
      >
        Finalizar Compra
      </Button>
      
      {!hasDomains && (
        <p className="text-sm text-amber-500 mt-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          É necessário adicionar pelo menos um domínio
        </p>
      )}
      
      {hasUnownedDomains && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Preencha as informações de titularidade para todos os domínios
        </p>
      )}
    </div>
  );
};

export default CartSummary;
