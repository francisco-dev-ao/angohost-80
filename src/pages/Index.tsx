
import React from "react";
import Layout from "@/components/Layout";
import DomainSearch from "@/components/DomainSearch";
import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import FeatureCard from "@/components/FeatureCard";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const hostingPlans = [
    {
      title: "Iniciante",
      description: "Ideal para sites pessoais e blogs",
      price: 14.90,
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
      price: 29.90,
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
      price: 59.90,
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

  const testimonials = [
    {
      quote: "Migrei meu site para a Hostify e a velocidade melhorou drasticamente. Suporte técnico simplesmente incomparável!",
      author: {
        name: "Carlos Silva",
        role: "CEO",
        company: "TechPro",
      }
    },
    {
      quote: "Depois de experimentar vários provedores, finalmente encontrei o que meu e-commerce precisava. Hospedagem estável e rápida!",
      author: {
        name: "Ana Souza",
        role: "Proprietária",
        company: "ModaShop",
      }
    },
    {
      quote: "A facilidade de gerenciar meus sites e o excelente suporte 24/7 fazem toda diferença. Recomendo totalmente!",
      author: {
        name: "Marcos Oliveira",
        role: "Desenvolvedor Web",
        company: "WebSolutions",
      }
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-pattern text-white">
        <div className="container py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hospedagem de alta performance para o seu site
              </h1>
              <p className="text-lg mb-8 text-white/90">
                Plataforma completa de hospedagem web com uptime garantido, suporte 24/7 e recursos avançados para o seu negócio online.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-primary"
                >
                  <Link to="/products/cpanel">Ver planos</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/contact">Fale conosco</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 animate-float">
                <h2 className="text-xl font-medium mb-4">Encontre o domínio perfeito</h2>
                <DomainSearch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos de Hospedagem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu projeto com a melhor relação custo-benefício do mercado.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {hostingPlans.map((plan) => (
              <PricingCard
                key={plan.title}
                {...plan}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="link">
              <Link to="/products/cpanel">Ver todos os planos de hospedagem</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a Hostify?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma infraestrutura robusta e recursos avançados para garantir o melhor desempenho do seu site.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              }
              title="99.9% de Uptime"
              description="Garantimos a disponibilidade do seu site com nossa infraestrutura robusta e redundante."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
              }
              title="Suporte 24/7"
              description="Nossa equipe especializada está sempre disponível para ajudar com qualquer questão técnica."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              }
              title="Painel cPanel"
              description="Interface intuitiva e completa para gerenciar seu site, emails, bancos de dados e mais."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 5V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1"/><path d="M4 20v-5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5"/><path d="M4 7v8"/><path d="M20 7v8"/><path d="M8 20v-2.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V20"/></svg>
              }
              title="CDN Integrada"
              description="Entrega de conteúdo rápida em todo o mundo com nossa CDN Cloudflare integrada."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>
              }
              title="SSL Gratuito"
              description="Todos os planos incluem certificados SSL gratuitos para garantir a segurança do seu site."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 16V4a2 2 0 0 1 2-2h11"/><path d="M5 14H4"/><path d="M9 14H8"/><path d="M13 14h-1"/><rect width="10" height="8" x="12" y="14" rx="2"/></svg>
              }
              title="SSD NVMe"
              description="Armazenamento em discos SSD NVMe de alta performance para carregamento ultrarrápido."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra por que milhares de clientes confiam na nossa plataforma de hospedagem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <CallToAction
            title="Comece hoje mesmo seu projeto online"
            description="Escolha um dos nossos planos de hospedagem ou registre seu domínio com preços imbatíveis."
            primaryActionText="Ver Planos"
            primaryActionHref="/products/cpanel"
            secondaryActionText="Registrar Domínio"
            secondaryActionHref="/products/domains"
          />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
