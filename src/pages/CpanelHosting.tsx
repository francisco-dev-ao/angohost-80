import React from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

const CpanelHosting = () => {
  const hostingPlans = [
    {
      title: "Iniciante",
      description: "Ideal para sites pessoais e blogs",
      price: formatPrice(14900),
      period: "mês",
      features: [
        { text: "1 Site", included: true },
        { text: "10GB SSD", included: true },
        { text: "50GB Tráfego", included: true },
        { text: "5 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: false },
        { text: "CDN Cloudflare", included: false },
        { text: "Migração Gratuita", included: false },
      ],
    },
    {
      title: "Business",
      description: "Perfeito para pequenos negócios",
      price: formatPrice(29900),
      period: "mês",
      popular: true,
      features: [
        { text: "10 Sites", included: true },
        { text: "50GB SSD", included: true },
        { text: "200GB Tráfego", included: true },
        { text: "20 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN Cloudflare", included: true },
        { text: "Migração Gratuita", included: true },
      ],
    },
    {
      title: "Profissional",
      description: "Para médias e grandes empresas",
      price: formatPrice(59900),
      period: "mês",
      features: [
        { text: "Sites Ilimitados", included: true },
        { text: "100GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "100 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN Cloudflare", included: true },
        { text: "Migração Gratuita", included: true },
      ],
    },
  ];

  const annualHostingPlans = hostingPlans.map(plan => ({
    ...plan,
    price: Number((plan.price * 10).toFixed(2)), // 2 months free with annual billing
    period: "ano"
  }));

  return (
    <Layout>
      <div className="bg-muted/50 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Hospedagem cPanel</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Nossa hospedagem cPanel oferece alto desempenho, segurança e facilidade de uso para gerenciar seus sites.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="monthly" className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Pagamento Mensal</TabsTrigger>
                <TabsTrigger value="annual">
                  Pagamento Anual
                  <span className="ml-2 bg-primary text-white text-xs py-0.5 px-2 rounded-full">
                    -16%
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-8">
                {hostingPlans.map((plan) => (
                  <PricingCard
                    key={plan.title}
                    {...plan}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="annual">
              <div className="grid md:grid-cols-3 gap-8">
                {annualHostingPlans.map((plan) => (
                  <PricingCard
                    key={plan.title}
                    {...plan}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Todos os planos incluem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossos planos são cheios de recursos para oferecer a melhor experiência de hospedagem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "Painel cPanel",
              "Certificado SSL Grátis",
              "Domínio Grátis*",
              "99.9% de Uptime",
              "Suporte 24/7",
              "Instalador WordPress",
              "Backup Automático",
              "CDN Cloudflare",
              "PHP Atualizado",
              "Migração Gratuita",
              "Base de Dados MySQL",
              "Criador de Sites",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            * Domínio grátis no primeiro ano com planos anuais.
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda está com dúvidas?</h2>
            <p className="mb-6 text-primary-foreground/90">
              Nossa equipe está pronta para ajudar você a escolher o melhor plano para o seu projeto.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
              >
                Fale com Especialista
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Ver FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CpanelHosting;
