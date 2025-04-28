
import React from "react";
import Layout from "@/components/Layout";
import DomainSearch from "@/components/DomainSearch";
import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import FeatureCard from "@/components/FeatureCard";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Server, Globe, Shield } from "lucide-react";

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
      quote: "Migrei meu site para a AngoHost e a velocidade melhorou drasticamente. O suporte técnico é simplesmente incomparável!",
      author: {
        name: "Carlos Silva",
        role: "CEO",
        company: "TechPro Angola",
      }
    },
    {
      quote: "Depois de experimentar vários provedores, finalmente encontrei o que meu e-commerce precisava. Hospedagem estável e rápida!",
      author: {
        name: "Ana Souza",
        role: "Proprietária",
        company: "ModaShop Luanda",
      }
    },
    {
      quote: "A facilidade de gerenciar meus sites e o excelente suporte 24/7 fazem toda diferença. Recomendo totalmente!",
      author: {
        name: "Marcos Oliveira",
        role: "Desenvolvedor Web",
        company: "WebSolutions Angola",
      }
    },
  ];

  return (
    <Layout>
      {/* Hero Section com presença humana */}
      <section className="bg-[#345990] text-white relative overflow-hidden">
        <div className="container py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Hospedagem de Sites de <br/> Alto Desempenho em Angola
              </h1>
              <p className="text-lg mb-8 text-white/90 max-w-lg">
                Impulsione seu negócio online com a melhor e mais confiável solução de hospedagem web em Angola, com uptime garantido e suporte local 24/7.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-[#345990]"
                >
                  <Link to="/products/cpanel">Ver planos</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/contact">Fale connosco</Link>
                </Button>
              </div>
              
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-white/20 p-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Uptime 99.9% garantido</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-white/20 p-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Suporte técnico 24/7</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-white/20 p-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>SSL grátis</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-medium mb-4">Encontre o domínio perfeito</h2>
                <DomainSearch />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background gradient para simular imagem de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#345990] to-[#264473]"></div>
        
        {/* Aqui seria colocada uma imagem de uma pessoa profissional */}
        <div className="absolute bottom-0 right-0 h-full w-full lg:w-1/3 bg-gradient-to-l from-[#264473]/90 to-transparent">
          {/* Placeholder para imagem de pessoa */}
          <div className="hidden lg:block absolute bottom-0 right-10 h-[90%] w-64 bg-gradient-to-t from-[#264473] to-transparent opacity-70"></div>
        </div>
      </section>
      
      {/* Logos de Parceiros */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="bg-gray-300 rounded h-full w-24 flex items-center justify-center">
                  <span className="text-xs text-gray-600">Parceiro {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#345990]">Planos de Hospedagem Web</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o seu projeto com a melhor relação custo-benefício do mercado angolano.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {hostingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="link" className="text-[#345990]">
              <Link to="/products/cpanel">Ver todos os planos de hospedagem</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section com Visual Empresarial */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#345990]">Por que escolher a AngoHost?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Oferecemos uma infraestrutura robusta e recursos avançados para garantir o melhor desempenho do seu site.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-[#345990]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">Infraestrutura Premium</h3>
                <p className="text-gray-600">Servidores de alta performance com tecnologia SSD NVMe para carregamentos ultrarrápidos do seu site.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#345990]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">Proteção Total</h3>
                <p className="text-gray-600">Certificados SSL gratuitos, backups diários e monitoramento 24/7 para garantir a segurança dos seus dados.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-[#345990]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">CDN Integrada</h3>
                <p className="text-gray-600">Integração com Cloudflare para entrega rápida de conteúdo em qualquer parte do mundo.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#345990]"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">Suporte Local 24/7</h3>
                <p className="text-gray-600">Equipe técnica especializada em Angola, pronta para atender suas necessidades a qualquer momento.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#345990]"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">Painel Intuitivo</h3>
                <p className="text-gray-600">Gerencie seus sites, domínios e emails facilmente através do painel cPanel ou Plesk.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#345990]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#345990]"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#345990]">Instalação em 1 Clique</h3>
                <p className="text-gray-600">Instale WordPress, Joomla, Drupal e outras aplicações populares com apenas um clique.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domínios Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
                <h2 className="text-3xl font-bold mb-6 text-[#345990]">Registre seu domínio .ao</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Garanta sua presença online com um domínio angolano. Oferecemos os melhores preços do mercado para domínios .ao, .co.ao e outras extensões.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Proteção de privacidade WHOIS incluída",
                    "Gerenciamento DNS fácil",
                    "Renovação automática",
                    "Painel de controle intuitivo"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="mr-2 text-[#345990]">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  className="bg-[#345990] hover:bg-[#345990]/90"
                >
                  <Link to="/domains">Ver preços de domínios</Link>
                </Button>
              </div>
              
              <div className="lg:w-1/2 bg-gray-50 p-8 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-[#345990]">Preços de domínios populares</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="font-medium">.ao</div>
                      <div className="text-lg font-bold text-[#345990]">AOA 12.500/ano</div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="font-medium">.co.ao</div>
                      <div className="text-lg font-bold text-[#345990]">AOA 9.900/ano</div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="font-medium">.com</div>
                      <div className="text-lg font-bold text-[#345990]">AOA 5.900/ano</div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="font-medium">.net</div>
                      <div className="text-lg font-bold text-[#345990]">AOA 5.900/ano</div>
                    </div>
                  </div>
                </div>
                <DomainSearch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#345990]/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#345990]">O que nossos clientes dizem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra por que empresas e profissionais em Angola confiam na nossa plataforma de hospedagem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

      {/* Email Profissional Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col-reverse lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-12 mt-8 lg:mt-0">
                <div className="bg-[#345990]/10 p-6 lg:p-8 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-[#345990]">Email Profissional para sua Empresa</h3>
                  <p className="text-gray-600 mb-4">
                    Use o nome da sua empresa no seu email profissional e transmita mais credibilidade aos seus clientes.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="rounded-lg bg-white p-4 flex items-center shadow-sm">
                      <div className="mr-4 text-[#345990]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Email Profissional</h4>
                        <p className="text-sm text-gray-500">A partir de AOA 990/mês</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 flex items-center shadow-sm">
                      <div className="mr-4 text-[#345990]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 7.7c-.1.6-.3 1.2-.7 1.7-.4.4-.9.8-1.4 1-.7.4-1.4.6-2.1.8-.3.1-.7.1-1 .2-.1 0-.2.1-.3.3-.2.4-.1.9.2 1.2.6.6 1.7.9 1.1 2.2-.6 1.3-2 0-2.4-.4-.1-.1-.1-.2-.1-.4-.1-.9-.7-1.2-1.6-1.1h-.1c-.6 0-1.2 0-1.8.1-1.1.2-2.2.6-3.1 1.5-1.5 1.4-2 3.3-1.4 5.2.4 1.5 1.5 2.4 2.8 3.2.9.5 1.7.5 2.4-.2.4-.4.8-.9 1.1-1.4.5-.6 1.2-.6 1.7.1.3.4.5.9.6 1.4.1.7-.2 1.1-.7 1.3-.3.1-.7.1-1 .2-.1 0-.5.1-.4.1h-7.8c-.3 0-.6-.1-.9-.2-.7-.3-1-.8-.7-1.4.2-.4.5-.4.9-.7.1-.1.1-.1 0-.2-.5-.8-1.3-1.1-2.1-1.5-.5-.2-1-.4-1.5-.6-1.2-.6-1.5-1.5-1-2.7.2-.4.4-.9.5-1.4.5-1.5.5-3-.2-4.4-.8-1.7-2.2-2.6-4-3.1-.5-.1-1-.2-1.5-.3-.1 0-.5-.1-.4-.1h9.3c.3 0 .5.1.4.4-.2.3-.3.7-.3 1-.2 1.1 1.1 1.5 1.7.6.2-.3.3-.6.5-1 .3-.6.6-1.1.9-1.7.1-.1.1-.2 0-.3-.1-.8-.7-1.5-1.4-2C11 1.3 10.2.9 9.4.6c-.4-.1-.9-.2-1.4-.3C7.7.2 7.3.1 7 .1H1c-.5 0-.8.3-1 .7 0 .1 0 .2.1.2.1.1.3.2.5.2a6.7 6.7 0 0 1 4.3 3c1 1.2 1.3 3.7 1.4 4.7M22 15c0 .5-.1.9-.2 1.3-.9 3.5-4.2 5.9-7.8 5.7-3-.1-5.6-2.4-6.3-5.4-.3-1.1-.4-2.2-.3-3.4.2-3.1 2.1-5.4 5.1-6.2.3-.1.5-.1.9-.2.1 0 .2 0 .2-.2s-.1-.2-.2-.2c-.9 0-1.7.2-2.5.5-2.2 1-3.7 2.6-4.4 5-.6 2.1-.3 4.2.7 6.1 1.6 2.9 4.1 4.3 7.3 4.5 3.9.2 7.1-2.1 8.3-5.7.3-1.1.5-2.3.3-3.5-.3-1.5-1-2.8-2.1-3.9-.7-.6-1.3-1.4-2-2-.1-.1-.2-.2-.4-.3-.2-.1-.4 0-.6.2-.1.2 0 .4.1.5.1.1.3.3.5.4.8.6 1.4 1.3 2 2.1.2.3.4.5.5.8.1.1.2.2.2.1v-.1c-.2-.3-.2-.6-.1-.9.1-.2.2-.3.4-.4h.1c.2.1.5.2.5.6 0 .4.1.8.1 1.2v.6zM0 10v.1c.4.3.9.4 1.4.5 1.5.4 3.1.5 4.5-.2.9-.5 1.2-1.2.8-2.1-.5-1.2-1.7-1.6-3.1-1-1 .4-1.5 1.4-1.8 2.3-.1.2.1.4.2.4z"/></svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Microsoft 365</h4>
                        <p className="text-sm text-gray-500">A partir de AOA 1.990/mês</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      asChild 
                      className="bg-[#345990] hover:bg-[#345990]/90"
                    >
                      <Link to="/products/email">Ver planos de email</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#345990]">Soluções de Email Profissional</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Comunique-se profissionalmente com seus clientes e parceiros usando soluções de email corporativo confiáveis e seguras.
                </p>
                <ul className="space-y-4">
                  {[
                    "Emails com o nome do seu domínio (seu.nome@suaempresa.ao)",
                    "Proteção avançada contra spam e vírus",
                    "Acesso pelo webmail ou no seu celular e computador",
                    "Integração com Microsoft Outlook e outros clientes de email",
                    "Opções de Microsoft 365 com pacote Office completo"
                  ].map((feature, index) => (
                    <li key={index} className="flex">
                      <div className="mr-3 mt-1 text-[#345990]">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#345990]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Pronto para iniciar seu projeto online?</h2>
            <p className="text-lg mb-8">
              Escolha um dos nossos planos de hospedagem ou registre seu domínio com preços imbatíveis. Estamos aqui para ajudar você a construir sua presença digital.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-gray-100 text-[#345990]"
              >
                <Link to="/products/cpanel">Ver planos de hospedagem</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/domains">Registrar domínio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
