
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Search, ArrowRight } from "lucide-react";
import DomainSearch from "@/components/DomainSearch";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a6ea5] via-[#345990] to-[#264473] z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[5%] w-80 h-80 rounded-full bg-blue-400/10 blur-3xl z-0"></div>
      <div className="absolute bottom-20 left-[5%] w-64 h-64 rounded-full bg-purple-400/10 blur-3xl z-0"></div>
      
      <div className="container max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content column */}
          <div>
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                Líder em serviços de hospedagem em Angola
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Hospedagem de Sites de <span className="text-yellow-300">Alto Desempenho</span> em Angola
              </h1>
              
              <p className="text-lg text-white/80 max-w-lg">
                Impulsione seu negócio online com a melhor e mais confiável solução de hospedagem web em Angola, com uptime garantido e suporte local 24/7.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-[#345990] font-medium text-base"
                >
                  <Link to="/products/cpanel" className="flex items-center gap-2">
                    Ver planos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 font-medium text-base"
                >
                  <Link to="/contact">Fale connosco</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 pt-8">
                {[
                  "Uptime 99.9% garantido",
                  "Suporte técnico 24/7",
                  "SSL grátis",
                  "Painel de controle cPanel",
                  "Backup diário",
                  "Migração gratuita"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="rounded-full bg-green-400/20 p-1 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-400" />
                    </div>
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right image column */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-sm border border-white/10 shadow-2xl"></div>
            <img 
              src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
              alt="Especialista AngoHost"
              className="relative rounded-lg shadow-2xl mx-auto transform hover:-translate-y-2 transition-transform duration-300"
              style={{maxHeight: "500px"}}
            />
          </div>
        </div>
      </div>
      
      {/* Domain search bar now appears below the hero content */}
      <div className="relative -mb-20 z-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Encontre o domínio perfeito para o seu negócio</h2>
              <p className="text-gray-600 text-sm mt-1">Verifique a disponibilidade do seu domínio .ao ou outras extensões</p>
            </div>
            <DomainSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
