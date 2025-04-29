
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PricingTabsSection = () => {
  const [activeCategory, setActiveCategory] = useState("hospedagem");
  
  const hostingPlans = [
    {
      title: "Plano Básico",
      price: 2500,
      period: "por mês",
      popular: false,
      features: [
        { text: "1 Site", included: true },
        { text: "10GB SSD", included: true },
        { text: "50GB Tráfego", included: true },
        { text: "5 Contas de Email", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: false },
      ],
    },
    {
      title: "Plano Profissional",
      price: 4500,
      period: "por mês",
      popular: true,
      features: [
        { text: "10 Sites", included: true },
        { text: "50GB SSD", included: true },
        { text: "200GB Tráfego", included: true },
        { text: "20 Contas de Email", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
      ],
    },
    {
      title: "Plano Empresarial",
      price: 8500,
      period: "por mês",
      popular: false,
      features: [
        { text: "Sites Ilimitados", included: true },
        { text: "100GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "100 Contas de Email", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
      ],
    },
  ];
  
  const emailPlans = [
    {
      title: "Email Básico",
      price: 1000,
      period: "por conta/mês",
      popular: false,
      features: [
        { text: "5GB de Espaço", included: true },
        { text: "Anti-spam/Antivírus", included: true },
        { text: "Webmail Responsivo", included: true },
        { text: "POP/IMAP", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Microsoft Office", included: false },
      ],
    },
    {
      title: "Email Empresarial",
      price: 1800,
      period: "por conta/mês",
      popular: true,
      features: [
        { text: "25GB de Espaço", included: true },
        { text: "Anti-spam/Antivírus", included: true },
        { text: "Webmail Responsivo", included: true },
        { text: "POP/IMAP", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Microsoft Office", included: false },
      ],
    },
    {
      title: "Microsoft 365",
      price: 3500,
      period: "por conta/mês",
      popular: false,
      features: [
        { text: "50GB de Espaço", included: true },
        { text: "Anti-spam/Antivírus", included: true },
        { text: "Webmail Responsivo", included: true },
        { text: "POP/IMAP", included: true },
        { text: "Suporte 24/7", included: true },
        { text: "Microsoft Office", included: true },
      ],
    },
  ];
  
  const domainPlans = [
    {
      title: ".AO",
      price: 10000,
      period: "por ano",
      popular: true,
      features: [
        { text: "Domínio Nacional", included: true },
        { text: "DNS Gerenciado", included: true },
        { text: "Proteção de Privacidade", included: true },
        { text: "Redirecionamento", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      title: ".CO.AO",
      price: 8000,
      period: "por ano",
      popular: false,
      features: [
        { text: "Domínio Nacional", included: true },
        { text: "DNS Gerenciado", included: true },
        { text: "Proteção de Privacidade", included: true },
        { text: "Redirecionamento", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      title: "Domínios Internacionais",
      price: 5000,
      period: "por ano",
      popular: false,
      features: [
        { text: "Extensões Diversas", included: true },
        { text: "DNS Gerenciado", included: true },
        { text: "Proteção de Privacidade", included: true },
        { text: "Redirecionamento", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-angohost-primary">Planos e Preços</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare nossos planos e encontre a melhor solução para seu negócio.
          </p>
        </div>
        
        <Tabs defaultValue="hospedagem" className="max-w-5xl mx-auto">
          <TabsList className="w-full flex mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="hospedagem" 
              className="flex-1"
              onClick={() => setActiveCategory("hospedagem")}
            >
              Hospedagem
            </TabsTrigger>
            <TabsTrigger 
              value="email" 
              className="flex-1"
              onClick={() => setActiveCategory("email")}
            >
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="dominios" 
              className="flex-1"
              onClick={() => setActiveCategory("dominios")}
            >
              Domínios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hospedagem" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {hostingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl border ${plan.popular ? 'border-angohost-primary shadow-md relative' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <Badge className="bg-angohost-primary">Mais Popular</Badge>
                    </div>
                  )}
                  <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price.toLocaleString()} Kz</span>
                      <span className="text-gray-500 text-sm"> {plan.period}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-angohost-primary hover:bg-angohost-primary/90' : 'border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white'}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                asChild
                variant="link" 
                className="text-angohost-primary"
              >
                <Link to="/cpanel-hosting">Ver detalhes de todos os planos de hospedagem</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {emailPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl border ${plan.popular ? 'border-angohost-primary shadow-md relative' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <Badge className="bg-angohost-primary">Mais Popular</Badge>
                    </div>
                  )}
                  <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price.toLocaleString()} Kz</span>
                      <span className="text-gray-500 text-sm"> {plan.period}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-angohost-primary hover:bg-angohost-primary/90' : 'border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white'}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                asChild
                variant="link" 
                className="text-angohost-primary"
              >
                <Link to="/professional-email">Ver detalhes de todos os planos de email</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dominios" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {domainPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl border ${plan.popular ? 'border-angohost-primary shadow-md relative' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <Badge className="bg-angohost-primary">Mais Popular</Badge>
                    </div>
                  )}
                  <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price.toLocaleString()} Kz</span>
                      <span className="text-gray-500 text-sm"> {plan.period}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-angohost-primary hover:bg-angohost-primary/90' : 'border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white'}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                asChild
                variant="link" 
                className="text-angohost-primary"
              >
                <Link to="/domains">Ver detalhes de todos os domínios</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PricingTabsSection;
