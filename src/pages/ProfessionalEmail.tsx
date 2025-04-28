
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { emailPlans } from "@/config/emailPlans";
import { formatPrice } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContactProfiles } from "@/hooks/useContactProfiles";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import EmailPlanDialog from "@/components/cart/EmailPlanDialog";
import { Card, CardContent } from "@/components/ui/card";

const ProfessionalEmail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useSupabaseAuth();
  const { profiles } = useContactProfiles();

  const [selectedTab, setSelectedTab] = useState("business");
  const [userCount, setUserCount] = useState(1);
  const [period, setPeriod] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getPlanByType = (type: string) => {
    return emailPlans.find(plan => plan.id === type) || emailPlans[0];
  };

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const calculatePrice = (basePrice: number) => {
    const emailPrice = basePrice * userCount * parseInt(period);
    return formatPrice(emailPrice);
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
    const items = [];

    // Add email plan to cart
    items.push({
      id: `email-${selectedPlan.id}-${Date.now()}`,
      title: `${selectedPlan.title} (${config.userCount} ${config.userCount === 1 ? 'usuário' : 'usuários'} por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: config.userCount,
      price: selectedPlan.basePrice * config.userCount * years,
      basePrice: selectedPlan.basePrice,
      type: "email"
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
        domain: config.newDomainName,
        contactProfileId: config.contactProfileId
      });
    }

    // Add each item to cart
    items.forEach(item => addToCart(item));

    setShowDialog(false);
    toast.success('Produtos adicionados ao carrinho');
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Email Profissional</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Soluções de email profissional para sua empresa com alto desempenho e segurança
        </p>
        
        <div className="max-w-md mx-auto mb-12 bg-muted/20 p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-medium mb-4">Configurar Plano</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="userCount">Número de usuários</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => userCount > 1 && setUserCount(userCount - 1)}
                  disabled={userCount <= 1}
                >-</Button>
                <Input
                  id="userCount"
                  type="number"
                  className="text-center"
                  value={userCount}
                  onChange={handleUserCountChange}
                  min={1}
                  max={1000}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => setUserCount(userCount + 1)}
                >+</Button>
              </div>
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
            
            <div>
              <Label>Tipo de plano</Label>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {emailPlans.map((plan) => {
            const isCurrentPlan = plan.id === selectedTab;
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

        {selectedPlan && (
          <EmailPlanDialog
            selectedPlan={selectedPlan}
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            onConfirm={handleConfirmPurchase}
          />
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<Mail className="w-6 h-6" />}
            title="Email Profissional"
            description="Use seu domínio próprio para emails corporativos com acesso em qualquer dispositivo"
          />
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Segurança Avançada"
            description="Proteção contra spam, vírus e ataques de phishing incluída em todos os planos"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Suporte 24/7"
            description="Nossa equipe está disponível 24 horas por dia, 7 dias por semana para ajudar você"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalEmail;
