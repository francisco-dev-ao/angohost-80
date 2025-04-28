
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const basePlans = [
    {
      title: "Email Premium",
      description: "Para pequenas empresas",
      basePrice: 12000,
      features: [
        { text: "5GB por usuário", included: true },
        { text: "Webmail responsivo", included: true },
        { text: "Antispam", included: true },
        { text: "Antivírus", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Backup diário", included: true },
      ],
    },
    {
      title: "Avançado Pro",
      description: "Para médias empresas",
      basePrice: 40000,
      popular: true,
      features: [
        { text: "25GB por usuário", included: true },
        { text: "Webmail responsivo", included: true },
        { text: "Antispam avançado", included: true },
        { text: "Antivírus", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Backup diário", included: true },
      ],
    },
    {
      title: "Business",
      description: "Para grandes empresas",
      basePrice: 30000,
      features: [
        { text: "50GB por usuário", included: true },
        { text: "Webmail responsivo", included: true },
        { text: "Antispam avançado", included: true },
        { text: "Antivírus", included: true },
        { text: "Suporte 24/7 prioritário", included: true },
        { text: "Backup diário", included: true },
      ],
    },
  ];

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const calculatePrice = (basePrice: number) => {
    return (basePrice * userCount * parseInt(period)).toFixed(2);
  };

  const handlePurchase = (plan: { title: string; basePrice: number }) => {
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlan) return;

    const price = Number(calculatePrice(selectedPlan.basePrice));
    const years = parseInt(period);
    
    addToCart({
      id: `${selectedPlan.title}-${Date.now()}`,
      title: `${selectedPlan.title} (${userCount} usuários por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: userCount,
      price: price,
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
          {basePlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              price={Number(calculatePrice(plan.basePrice))}
              period={`${period} ${parseInt(period) === 1 ? 'ano' : 'anos'}`}
              ctaText="Comprar"
              onAction={() => handlePurchase(plan)}
            />
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar plano</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="userCountDialog">Número de usuários (1-1000)</Label>
                <Input
                  id="userCountDialog"
                  type="number"
                  min="1"
                  max="1000"
                  value={userCount}
                  onChange={handleUserCountChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="period">Período de contratação</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period" className="mt-2">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ano</SelectItem>
                    <SelectItem value="2">2 anos</SelectItem>
                    <SelectItem value="3">3 anos</SelectItem>
                    <SelectItem value="4">4 anos</SelectItem>
                    <SelectItem value="5">5 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedPlan && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Preço total:</p>
                  <p className="text-lg font-semibold">
                    {calculatePrice(selectedPlan.basePrice)} kz/{period} {parseInt(period) === 1 ? 'ano' : 'anos'}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmPurchase}>
                Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
