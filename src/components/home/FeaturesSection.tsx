
import React from "react";
import { Server, Shield, Globe } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
