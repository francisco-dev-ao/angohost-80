
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Server, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfessionalEmail = () => {
  const [userCount, setUserCount] = useState(1);

  const basePlans = [
    {
      title: "Email Basic",
      description: "Para pequenas empresas",
      basePrice: 4.99,
      features: [
        { text: "10GB por usuário", included: true },
        { text: "Webmail responsivo", included: true },
        { text: "Antispam", included: true },
        { text: "Antivírus", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Backup diário", included: false },
      ],
    },
    {
      title: "Email Pro",
      description: "Para médias empresas",
      basePrice: 9.99,
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
      title: "Email Enterprise",
      description: "Para grandes empresas",
      basePrice: 14.99,
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
    if (!isNaN(value) && value > 0) {
      setUserCount(value);
    }
  };

  const calculatePrice = (basePrice: number) => {
    return (basePrice * userCount).toFixed(2);
  };

  const handleQuoteRequest = () => {
    toast.success(`Cotação solicitada para ${userCount} usuários`);
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Email Profissional</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Soluções de email profissional para sua empresa
        </p>

        <div className="max-w-sm mx-auto mb-12">
          <div className="space-y-4">
            <Label htmlFor="userCount">Número de usuários</Label>
            <Input
              id="userCount"
              type="number"
              min="1"
              value={userCount}
              onChange={handleUserCountChange}
              className="text-center"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {basePlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              price={Number(calculatePrice(plan.basePrice))}
              period="mês"
              ctaText="Solicitar cotação"
            />
          ))}
        </div>

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
