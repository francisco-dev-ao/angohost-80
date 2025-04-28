
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutUsSection = () => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#345990]">Sobre a AngoHost</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Conheça a empresa líder em soluções de hospedagem web em Angola
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#345990]">Nossa História</h3>
            <p className="mb-4 text-gray-600">
              Fundada em 2015, a AngoHost nasceu com a missão de fornecer soluções de hospedagem web de alta qualidade para empresas angolanas. 
              Começamos como uma pequena equipe apaixonada por tecnologia e crescemos para nos tornar um dos principais provedores de serviços web no país.
            </p>
            <p className="mb-4 text-gray-600">
              Nossa jornada tem sido marcada pela inovação constante e pelo compromisso com a excelência técnica, sempre focados em oferecer a melhor experiência para nossos clientes.
            </p>
            
            <div className="flex gap-4 mt-6">
              <Button asChild>
                <Link to="/about" className="flex items-center">
                  Conheça nossa equipe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-[#345990]/10 h-40 rounded-lg flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-[#345990] font-bold text-4xl">7+</div>
                  <div className="text-gray-600 mt-1">Anos de experiência</div>
                </div>
              </div>
              <div className="bg-[#345990]/10 h-40 rounded-lg flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-[#345990] font-bold text-4xl">99.9%</div>
                  <div className="text-gray-600 mt-1">Tempo de atividade</div>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="bg-[#345990]/10 h-40 rounded-lg flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-[#345990] font-bold text-4xl">5000+</div>
                  <div className="text-gray-600 mt-1">Clientes satisfeitos</div>
                </div>
              </div>
              <div className="bg-[#345990]/10 h-40 rounded-lg flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-[#345990] font-bold text-4xl">24/7</div>
                  <div className="text-gray-600 mt-1">Suporte técnico</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#345990]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#345990]">
                  <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/>
                  <path d="m3 7 18 0"/>
                  <path d="m8 2 0 3"/>
                  <path d="m16 2 0 3"/>
                  <path d="M12 14v-4"/>
                  <path d="M12 14h4"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#345990]">Confiabilidade</h4>
              <p className="text-gray-600">
                Nossos servidores têm uptime de 99.9%, garantindo que seu site esteja sempre online para seus clientes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#345990]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#345990]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#345990]">Segurança</h4>
              <p className="text-gray-600">
                Proteção avançada contra ameaças, backups diários automatizados e certificados SSL gratuitos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#345990]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#345990]">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 4"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#345990]">Suporte 24/7</h4>
              <p className="text-gray-600">
                Nossa equipe de especialistas está disponível a qualquer hora para ajudar com suas dúvidas técnicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
