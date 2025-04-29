
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { emailPlans } from "@/config/emailPlans";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export const useEmailPlans = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useSupabaseAuth();

  const [selectedTab, setSelectedTab] = useState("advanced"); // Default to the new popular plan
  const [userCount, setUserCount] = useState(1);
  const [period, setPeriod] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getPlanByType = (type: string) => {
    return emailPlans.find(plan => plan.id === type) || emailPlans.find(plan => plan.popular) || emailPlans[0];
  };

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const getDiscount = (years: number) => {
    if (years >= 3) return 0.10; // 10% discount for 3 years
    if (years >= 2) return 0.05; // 5% discount for 2 years
    return 0;
  };

  const calculatePrice = (basePrice: number) => {
    const years = parseInt(period);
    const discount = getDiscount(years);
    
    // Calculate the total price with discount
    let totalPrice = basePrice * userCount * years;
    if (discount > 0) {
      totalPrice = totalPrice - (totalPrice * discount);
    }
    
    return totalPrice;
  };

  const handlePurchase = (plan: any) => {
    if (!user) {
      toast.error("Faça login para continuar");
      navigate("/register");
      return;
    }
    
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleConfirmPurchase = (config: { 
    userCount: number; 
    period: string; 
    domainOption: string;
    newDomainName?: string;
    selectedExistingDomain?: string;
    contactProfileId?: string;
  }) => {
    if (!selectedPlan) return;

    const years = parseInt(config.period);
    const discount = getDiscount(years);
    const items = [];

    // Calculate price with discount
    let totalPrice = selectedPlan.basePrice * config.userCount * years;
    if (discount > 0) {
      totalPrice = totalPrice - (totalPrice * discount);
    }

    // Add email plan to cart
    items.push({
      id: `email-${selectedPlan.id}-${Date.now()}`,
      title: `${selectedPlan.title} (${config.userCount} ${config.userCount === 1 ? 'usuário' : 'usuários'} por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: config.userCount,
      price: totalPrice,
      basePrice: selectedPlan.basePrice,
      years: years,
      type: "email",
      discountApplied: discount > 0 ? `${discount * 100}%` : undefined
    });

    // Add domain to cart if registering new one
    if (config.domainOption === "new" && config.newDomainName) {
      items.push({
        id: `domain-${Date.now()}`,
        title: `Domínio: ${config.newDomainName}`,
        quantity: 1,
        price: 2000, // Domain registration fee
        basePrice: 2000,
        type: "domain",
        domain: config.newDomainName
      });
    }

    // Add each item to cart
    items.forEach(item => addToCart(item));

    setShowDialog(false);
    toast.success('Produtos adicionados ao carrinho');
    navigate('/cart');
  };

  return {
    selectedTab,
    setSelectedTab,
    userCount,
    setUserCount,
    period,
    setPeriod,
    selectedPlan,
    setSelectedPlan,
    showDialog,
    setShowDialog,
    getPlanByType,
    handleUserCountChange,
    calculatePrice,
    handlePurchase,
    handleConfirmPurchase,
    emailPlans,
    getDiscount
  };
};
