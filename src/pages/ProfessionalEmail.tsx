
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { emailPlans } from "@/config/emailPlans";
import PurchaseDialog from "@/components/email/PurchaseDialog";
import { formatPrice } from "@/utils/formatters";

const ProfessionalEmail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [userCount, setUserCount] = useState(1);
  const [period, setPeriod] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<null | {
    title: string;
    basePrice: number;
  }>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const calculatePrice = (basePrice: number) => {
    return formatPrice(basePrice * userCount * parseInt(period));
  };

  const handlePurchase = (plan: { title: string; basePrice: number }) => {
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlan) return;

    const years = parseInt(period);
    
    addToCart({
      id: `${selectedPlan.title}-${Date.now()}`,
      title: `${selectedPlan.title} (${userCount} usuários por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: userCount,
      price: selectedPlan.basePrice * userCount * years,
      basePrice: selectedPlan.basePrice,
    });

    setShowDialog(false);
    navigate('/cart');
    toast.success('Produto adicionado ao carrinho');
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Email Profissional</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Soluções de email profissional para sua empresa
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {emailPlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              price={calculatePrice(plan.basePrice)}
              period={`${period} ${parseInt(period) === 1 ? 'ano' : 'anos'}`}
              ctaText="Comprar"
              onAction={() => handlePurchase(plan)}
            />
          ))}
        </div>

        <PurchaseDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          userCount={userCount}
          handleUserCountChange={handleUserCountChange}
          period={period}
          setPeriod={setPeriod}
          selectedPlan={selectedPlan}
          calculatePrice={calculatePrice}
          onConfirm={handleConfirmPurchase}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mail className="w-6 h-6" />}
            title="Email Profissional"
            description="Use seu domínio próprio para emails corporativos"
          />
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Segurança Avançada"
            description="Proteção contra spam e vírus incluída"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Acesso Global"
            description="Acesse seus emails de qualquer lugar e dispositivo"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalEmail;
