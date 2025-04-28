
import React from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Server, Database, Globe } from "lucide-react";

const WordPressHosting = () => {
  const plans = [
    {
      title: "WordPress Basic",
      description: "Ideal para blogs e sites pessoais",
      price: 19.99,
      period: "mês",
      features: [
        { text: "1 Site WordPress", included: true },
        { text: "10GB SSD", included: true },
        { text: "50GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: false },
      ],
    },
    {
      title: "WordPress Pro",
      description: "Perfeito para empresas",
      price: 39.99,
      period: "mês",
      popular: true,
      features: [
        { text: "5 Sites WordPress", included: true },
        { text: "30GB SSD", included: true },
        { text: "100GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: true },
      ],
    },
    {
      title: "WordPress Business",
      description: "Para grandes projetos",
      price: 79.99,
      period: "mês",
      features: [
        { text: "10 Sites WordPress", included: true },
        { text: "100GB SSD", included: true },
        { text: "500GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: true },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Hospedagem WordPress</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Hospedagem otimizada para WordPress com instalação em 1 clique
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Performance Otimizada"
            description="Servidores otimizados especificamente para WordPress com cache LiteSpeed"
          />
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Backup Diário"
            description="Seus dados sempre seguros com backup diário automático"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="SSL Grátis"
            description="Certificado SSL grátis para todos os seus sites"
          />
        </div>
      </div>
    </Layout>
  );
};

export default WordPressHosting;
